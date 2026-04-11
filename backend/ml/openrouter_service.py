import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class OpenRouterService:
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        self.base_url = "https://openrouter.ai/api/v1"
        self.client = OpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
        )
        # Default model as requested, with fallbacks
        self.models = [
            "google/gemma-4-31b-it:free", # Primary Model
            "minimax/minimax-m2.5:free",
            "openai/gpt-oss-120b:free"
        ]

    def analyze_report_insights(self, report_text: str) -> dict:
        """
        Specialized prompt for deep report analysis excluding treatment exploration.
        """
        prompt = f"""
        Analyze the following medical report and provide a deep explanation and health suggestions.
        
        Report Text: {report_text}
        
        Please provide the analysis in the following JSON format:
        {{
            "report_summary": "A comprehensive but easy-to-understand explanation of the key findings in the report.",
            "lifestyle_recommendations": "Non-medical suggestions related to activity, sleep, stress, and habits.",
            "nutrition_advice": "Specific dietary suggestions or restrictions based on the report data.",
            "key_metrics_explained": "Break down any complex medical terms or metrics found in the report.",
            "next_steps": "General non-treatment advice, like monitoring or standard follow-up with a professional."
        }}
        
        Important: 
        1. DO NOT suggest specific medicines or treatments.
        2. Focus on education and general wellness.
        3. Only return valid JSON.
        """

        for model_name in self.models:
            try:
                response = self.client.chat.completions.create(
                    extra_headers={
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "SymptoSense",
                    },
                    model=model_name,
                    messages=[
                        {"role": "system", "content": "You are a medical data analyst focused on providing clear insights and wellness recommendations from clinical reports."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                
                content = response.choices[0].message.content
                return json.loads(content)
            except Exception as e:
                print(f"Error calling model {model_name} for insights: {e}")
                continue
        
        return {"error": "Failed to generate insights."}

    def analyze_medical_condition(self, symptoms: str, report_text: str = "") -> dict:
        """
        Unified prompt to analyze symptoms and provide treatments, lifestyle and nutrition advice.
        """
        prompt = f"""
        Analyze the following medical information and provide a structured response.
        
        Symptoms Provided by User: {symptoms}
        Extracted Text from Medical Report: {report_text if report_text else 'None provided'}
        
        Please provide the analysis in the following JSON format:
        {{
            "condition_analysis": "A detailed explanation of the possible conditions based on symptoms.",
            "treatments": "A list of standard treatment options and next steps. Include a bold medical disclaimer.",
            "lifestyle_recommendations": "Advice on daily habits, sleep, and activity.",
            "nutrition_advice": "Recommended foods or dietary restrictions.",
            "medical_disclaimer": "URGENT: This is an AI-generated analysis for informational purposes only. Consult a certified medical professional before taking any action."
        }}
        
        Important: 
        1. Be professional and Empathetic.
        2. Always include the medical disclaimer.
        3. Only return valid JSON.
        """

        for model_name in self.models:
            try:
                response = self.client.chat.completions.create(
                    extra_headers={
                        "HTTP-Referer": "http://localhost:3000", # Optional, for OpenRouter rankings
                        "X-Title": "SymptoSense", # Optional
                    },
                    model=model_name,
                    messages=[
                        {"role": "system", "content": "You are a professional medical AI assistant specialized in symptom analysis and health recommendations."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                
                content = response.choices[0].message.content
                return json.loads(content)
            except Exception as e:
                print(f"Error calling model {model_name}: {e}")
                continue
        
        return {
            "error": "Failed to generate analysis after trying all models.",
            "medical_disclaimer": "URGENT: Consult a doctor immediately."
        }

openrouter_service = OpenRouterService()
