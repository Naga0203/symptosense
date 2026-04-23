"""
Base Agent class built with LangChain for OpenRouter-powered medical AI agents.
Each agent gets its own API key and model configuration.
Includes a fallback mechanism to the primary API key if the agent-specific key fails.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv

load_dotenv()

# Set up logging to avoid cluttering stdout but still capture errors
logger = logging.getLogger(__name__)

class BaseMedicalAgent:
    """
    Abstract base class for all medical AI agents.
    Each subclass configures its own API key, model, system prompt, and disclaimer.
    """

    AGENT_NAME: str = "BaseAgent"
    ENV_API_KEY: str = ""
    ENV_MODEL: str = ""
    DEFAULT_MODEL: str = "minimax/minimax-m2.5:free"

    DISCLAIMER: str = (
        "⚠️ MEDICAL DISCLAIMER: This AI-generated content is for informational "
        "purposes only and does NOT constitute medical advice. Always consult a "
        "qualified healthcare professional before making any medical decisions."
    )

    def __init__(self):
        # 1. Use agent-specific key strictly as requested
        self.api_key = os.getenv(self.ENV_API_KEY)
        
        # Fallback to primary ONLY if agent-specific key is not defined at all in .env
        if not self.api_key:
            self.api_key = os.getenv('OPENROUTER_API_KEY', '')
            
        self.preferred_model = os.getenv(self.ENV_MODEL) or self.DEFAULT_MODEL
        self.model_name = self.preferred_model
        
        self.output_parser = JsonOutputParser()

    def _get_llm(self, api_key: str, model_name: str):
        """Helper to create the LLM client with a strict timeout."""
        return ChatOpenAI(
            openai_api_key=api_key,
            openai_api_base="https://openrouter.ai/api/v1",
            model_name=model_name,
            temperature=0.4,
            max_tokens=2000,
            timeout=30, # Prevent hanging on slow requests
            max_retries=0,   # Disable internal retries to surface errors immediately
            model_kwargs={
                "extra_headers": {
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "SymptoSense",
                }
            },
        )

    def run(self, disease: str, symptoms: str = "") -> Dict[str, Any]:
        """Execute with retry logic but NO multiple fallback keys."""
        import time
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._build_system_prompt()),
            ("human", self._build_user_prompt(disease, symptoms)),
        ])

        # Helper for internal retry on rate limits
        def _attempt_execution(current_key, current_model, attempt_num=1):
            try:
                return self._execute_chain(prompt, disease, symptoms, current_key, current_model)
            except Exception as e:
                error_str = str(e)
                # Handle 429 Rate Limit - Wait shorter (10s) to be responsive
                if "429" in error_str or "rate_limit" in error_str.lower():
                    if attempt_num <= 1: # Reduced to 1 retry to save time
                        print(f"  [WAIT] {self.AGENT_NAME} hit rate limit. Retrying in 10s... (Attempt {attempt_num})")
                        time.sleep(10)
                        return _attempt_execution(current_key, current_model, attempt_num + 1)
                
                # If it's a timeout, don't retry, just bubble it up to fallback or fail
                if "timeout" in error_str.lower() or "deadline" in error_str.lower():
                    print(f"  [TIMEOUT] {self.AGENT_NAME} request timed out after 30s.")
                    raise e
                    
                raise e

        try:
            print(f"  [RUN] {self.AGENT_NAME} calling {self.model_name}...")
            return _attempt_execution(self.api_key, self.model_name)
        except Exception as e:
            error_str = str(e)
            print(f"  [DEBUG_ERROR] {self.AGENT_NAME} FAILED with model {self.model_name}.")
            print(f"  [DEBUG_DETAILS] Error: {error_str}")
            
            # Final attempt with DEFAULT_MODEL if preferred model failed (but same key)
            if self.model_name != self.DEFAULT_MODEL:
                try:
                    print(f"  [FALLBACK] {self.AGENT_NAME} retrying with {self.DEFAULT_MODEL}...")
                    return _attempt_execution(self.api_key, self.DEFAULT_MODEL)
                except Exception as model_fail:
                    print(f"  [CRITICAL] {self.AGENT_NAME} fallback also failed.")
                    print(f"  [DEBUG_DETAILS] Fallback Error: {str(model_fail)}")
                    return self._build_error_response(f"Agent failed after model fallback. Error: {str(model_fail)}")
            
            return self._build_error_response(error_str)

    def _execute_chain(self, prompt, disease, symptoms, api_key, model_name) -> Dict[str, Any]:
        llm = self._get_llm(api_key, model_name)
        chain = prompt | llm | self.output_parser
        
        try:
            result = chain.invoke({"disease": disease, "symptoms": symptoms})
        except Exception as parse_err:
            # Fallback for non-JSON responses
            raw_chain = prompt | llm
            raw_result = raw_chain.invoke({"disease": disease, "symptoms": symptoms})
            content = raw_result.content
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            result = json.loads(content)

        if result is None:
            result = {}

        # Attach metadata
        result["agent_name"] = self.AGENT_NAME
        result["model_used"] = model_name
        result["medical_disclaimer"] = self.DISCLAIMER
        return result

    def _build_error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "error": f"[{self.AGENT_NAME}] {error_msg}",
            "agent_name": self.AGENT_NAME,
            "medical_disclaimer": self.DISCLAIMER
        }

    def _build_system_prompt(self) -> str: raise NotImplementedError
    def _build_user_prompt(self, disease: str, symptoms: str) -> str: raise NotImplementedError
