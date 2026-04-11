"""
Agent 1: Recommendation Agent
──────────────────────────────
Provides actionable medical recommendations including specialist referrals,
diagnostic tests, and immediate action items when a disease is predicted.

Model : google/gemma-3-27b-it  (configurable via RECOMMENDATION_AGENT_MODEL)
API Key: RECOMMENDATION_AGENT_API_KEY

"""

from .base_agent import BaseMedicalAgent


class RecommendationAgent(BaseMedicalAgent):

    AGENT_NAME = "Recommendation Agent"
    ENV_API_KEY = "RECOMMENDATION_AGENT_API_KEY"
    ENV_MODEL = "RECOMMENDATION_AGENT_MODEL"
    DEFAULT_MODEL = "google/gemma-4-31b-it:free"

    DISCLAIMER = (
        "⚠️ RECOMMENDATION DISCLAIMER: These recommendations are AI-generated "
        "and intended for educational purposes only. They are NOT a substitute "
        "for professional medical consultation. Individual conditions vary — "
        "always seek advice from a licensed healthcare provider before acting "
        "on any recommendation."
    )

    def _build_system_prompt(self) -> str:
        return (
            "You are a senior medical recommendation specialist with expertise in "
            "evidence-based medicine. Your role is to provide actionable, prioritized "
            "recommendations when a disease is identified. You must be thorough yet "
            "concise, and always emphasize the importance of professional consultation.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
A neural network model has predicted the following disease:

**Predicted Disease:** {disease}
**Patient Symptoms:** {symptoms}

Based on this prediction, provide structured medical recommendations in the following JSON format:

{{
    "disease": "{disease}",
    "priority_level": "HIGH / MEDIUM / LOW — based on disease severity",
    "immediate_actions": [
        "Action 1 the patient should take right now",
        "Action 2 the patient should take right now"
    ],
    "recommended_specialists": [
        {{
            "specialist": "Type of doctor",
            "reason": "Why this specialist is needed"
        }}
    ],
    "diagnostic_tests": [
        {{
            "test_name": "Name of test",
            "purpose": "Why this test helps confirm or monitor the condition"
        }}
    ],
    "monitoring_plan": "How the patient should monitor their condition going forward",
    "when_to_seek_emergency": "Red flag symptoms that require immediate emergency care",
    "follow_up_timeline": "Recommended timeline for follow-up appointments"
}}

Provide thorough, evidence-based recommendations. Be empathetic and professional.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, priority_level, immediate_actions, "
            "recommended_specialists, diagnostic_tests, monitoring_plan, "
            "when_to_seek_emergency, follow_up_timeline"
        )
