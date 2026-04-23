"""
Agent 4: Lifestyle & Diet Agent
─────────────────────────────────
Provides personalized lifestyle modifications, dietary plans,
exercise recommendations, and mental health support for the predicted disease.

Model : microsoft/phi-4  (configurable via LIFESTYLE_DIET_AGENT_MODEL)
API Key: LIFESTYLE_DIET_AGENT_API_KEY
"""

from .base_agent import BaseMedicalAgent


class LifestyleDietAgent(BaseMedicalAgent):
    AGENT_NAME = "Lifestyle & Diet Agent"
    ENV_API_KEY = "LIFESTYLE_DIET_AGENT_API_KEY"
    ENV_MODEL = "LIFESTYLE_DIET_AGENT_MODEL"
    DEFAULT_MODEL = "minimax/minimax-m2.5:free"

    DISCLAIMER = (
        "⚠️ LIFESTYLE & DIET DISCLAIMER: The lifestyle and dietary suggestions provided "
        "are AI-generated and intended as general wellness guidance only. Consult a "
        "registered dietitian or your healthcare provider before making significant "
        "changes to your diet or exercise routine."
    )

    def _build_system_prompt(self) -> str:
        return (
            "You are a certified nutritionist and lifestyle medicine specialist. Your role "
            "is to provide holistic lifestyle and dietary guidance tailored to specific "
            "medical conditions. Cover nutrition, exercise, sleep, and stress management.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
Provide lifestyle and dietary guidance for:
Predicted Disease: {disease}
Patient Symptoms: {symptoms}

Return a structured JSON response:
{{
    "disease": "{disease}",
    "dietary_recommendations": {{
        "foods_to_include": [
            {{
                "food_category": "e.g., Leafy Greens",
                "examples": ["example 1", "example 2"],
                "benefit": "Why it helps {disease}"
            }}
        ],
        "foods_to_avoid": [
            {{
                "food_category": "e.g., Processed Sugars",
                "examples": ["example 1", "example 2"],
                "reason": "Why it worsens {disease}"
            }}
        ],
        "sample_meal_plan": {{
            "breakfast": "Meal idea",
            "lunch": "Meal idea",
            "dinner": "Meal idea",
            "snacks": "Snack idea"
        }},
        "hydration": "Fluid intake guidance"
    }},
    "exercise_recommendations": {{
        "recommended_activities": ["activity 1", "activity 2"],
        "frequency": "Frequency",
        "duration": "Duration",
        "intensity": "Intensity level",
        "activities_to_avoid": "What to avoid for {disease}"
    }},
    "sleep_guidance": {{
        "recommended_hours": "Duration",
        "sleep_hygiene_tips": ["tip 1", "tip 2"]
    }},
    "stress_management": {{
        "techniques": ["technique 1", "technique 2"],
        "importance": "Relevance to {disease}"
    }},
    "mental_health": "Emotional well-being guidance",
    "supplements": [
        {{
            "name": "Supplement name",
            "dosage": "Typical dosage",
            "benefit": "Benefit for {disease}"
        }}
    ]
}}

Ensure all recommendations are specific to {disease}. Be practical and empathetic.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, dietary_recommendations, exercise_recommendations, "
            "sleep_guidance, stress_management, mental_health, supplements"
        )
