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
    DEFAULT_MODEL = "google/gemma-4-31b-it:free"

    DISCLAIMER = (
        "⚠️ LIFESTYLE & DIET DISCLAIMER: The lifestyle and dietary suggestions provided "
        "are AI-generated and intended as general wellness guidance only. Individual nutritional "
        "needs vary based on age, weight, medications, allergies, and other health conditions. "
        "Consult a registered dietitian or your healthcare provider before making significant "
        "changes to your diet or exercise routine."
    )

    def _build_system_prompt(self) -> str:
        return (
            "You are a certified nutritionist and lifestyle medicine specialist. "
            "Your role is to provide holistic lifestyle and dietary guidance tailored "
            "to specific medical conditions. You cover nutrition, exercise, sleep, "
            "stress management, and mental well-being. You are evidence-based and "
            "practical in your recommendations.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
A neural network model has predicted the following disease:

**Predicted Disease:** {disease}
**Patient Symptoms:** {symptoms}

Provide comprehensive lifestyle and dietary recommendations in the following JSON format:

{{
    "disease": "{disease}",
    "dietary_recommendations": {{
        "foods_to_include": [
            {{
                "food_category": "Category name (e.g., Leafy Greens)",
                "examples": ["Spinach", "Kale", "Swiss Chard"],
                "benefit": "Why this food group helps with the condition"
            }}
        ],
        "foods_to_avoid": [
            {{
                "food_category": "Category name (e.g., Processed Sugars)",
                "examples": ["Candy", "Soda", "Pastries"],
                "reason": "Why this food group may worsen the condition"
            }}
        ],
        "sample_meal_plan": {{
            "breakfast": "Suggested breakfast with specific items",
            "lunch": "Suggested lunch with specific items",
            "dinner": "Suggested dinner with specific items",
            "snacks": "Healthy snack options"
        }},
        "hydration": "Recommended daily fluid intake and preferences"
    }},
    "exercise_recommendations": {{
        "recommended_activities": ["Activity 1", "Activity 2"],
        "frequency": "How often to exercise",
        "duration": "How long each session",
        "intensity": "Appropriate intensity level",
        "activities_to_avoid": "Any physical activities that may be harmful"
    }},
    "sleep_guidance": {{
        "recommended_hours": "Optimal sleep duration",
        "sleep_hygiene_tips": ["Tip 1", "Tip 2"]
    }},
    "stress_management": {{
        "techniques": ["Technique 1", "Technique 2"],
        "importance": "Why stress management matters for this condition"
    }},
    "mental_health": "Guidance on mental health and emotional well-being related to managing this condition",
    "supplements": [
        {{
            "name": "Supplement name",
            "dosage": "Typical dosage (always confirm with doctor)",
            "benefit": "How it supports the condition"
        }}
    ]
}}

Be practical, empathetic, and specific. Provide actionable daily habits the patient can start immediately.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, dietary_recommendations, exercise_recommendations, "
            "sleep_guidance, stress_management, mental_health, supplements"
        )
