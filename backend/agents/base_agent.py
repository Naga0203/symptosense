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
    DEFAULT_MODEL: str = "google/gemma-4-31b-it:free"

    DISCLAIMER: str = (
        "⚠️ MEDICAL DISCLAIMER: This AI-generated content is for informational "
        "purposes only and does NOT constitute medical advice. Always consult a "
        "qualified healthcare professional before making any medical decisions."
    )

    def __init__(self):
        # 1. Try agent-specific key first, then primary key
        self.api_key = os.getenv(self.ENV_API_KEY) or os.getenv('OPENROUTER_API_KEY', '')
        self.model_name = os.getenv(self.ENV_MODEL) or self.DEFAULT_MODEL
        
        self.output_parser = JsonOutputParser()

    def _get_llm(self, api_key: str):
        """Helper to create the LLM client."""
        return ChatOpenAI(
            openai_api_key=api_key,
            openai_api_base="https://openrouter.ai/api/v1",
            model_name=self.model_name,
            temperature=0.4,
            max_tokens=2000,
            model_kwargs={
                "extra_headers": {
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "SymptoSense",
                }
            },
        )

    def run(self, disease: str, symptoms: str = "") -> Dict[str, Any]:
        """Execute with fallback and error handling."""
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._build_system_prompt()),
            ("human", self._build_user_prompt(disease, symptoms)),
        ])

        # Try execution
        try:
            return self._execute_chain(prompt, disease, symptoms)
        except Exception as e:
            # If agent-specific key failed (e.g. 404 or auth error), try primary key as fallback
            primary_key = os.getenv('OPENROUTER_API_KEY')
            if primary_key and primary_key != self.api_key:
                try:
                    # Replace key and retry
                    self.api_key = primary_key
                    return self._execute_chain(prompt, disease, symptoms)
                except Exception as fallback_err:
                    return self._build_error_response(f"Both keys failed. Primary key error: {str(fallback_err)}")
            
            return self._build_error_response(str(e))

    def _execute_chain(self, prompt, disease, symptoms) -> Dict[str, Any]:
        llm = self._get_llm(self.api_key)
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

        # Attach metadata
        result["agent_name"] = self.AGENT_NAME
        result["model_used"] = self.model_name
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
