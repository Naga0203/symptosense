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
    DEFAULT_MODEL = "minimax/minimax-m2.5:free"

    DISCLAIMER = (
        "⚠️ RECOMMENDATION DISCLAIMER: These recommendations are AI-generated "
        "and intended for educational purposes only. They are NOT a substitute "
        "for professional medical consultation. Individual conditions vary — "
        "always seek advice from a licensed healthcare provider before acting "
        "on any recommendation."
    )

    def _build_system_prompt(self) -> str:
        return (
            "You are a senior medical recommendation specialist. Your role is to provide "
            "actionable, prioritized recommendations when a disease is identified. "
            "Be thorough yet concise, and always emphasize professional consultation.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
Provide medical recommendations for the following:
Predicted Disease: {disease}
Patient Symptoms: {symptoms}

Return a structured JSON response:
{{
    "disease": "{disease}",
    "priority_level": "HIGH / MEDIUM / LOW based on severity",
    "immediate_actions": [
        "Immediate action item 1",
        "Immediate action item 2"
    ],
    "recommended_specialists": [
        {{
            "specialist": "Specialist type (e.g., Cardiologist)",
            "reason": "Why this specialist is relevant"
        }}
    ],
    "diagnostic_tests": [
        {{
            "test_name": "Test name (e.g., Blood Sugar)",
            "purpose": "Why this test is needed"
        }}
    ],
    "monitoring_plan": "Specific metrics or symptoms the patient should track",
    "when_to_seek_emergency": "Specific red-flag symptoms for {disease}",
    "follow_up_timeline": "Recommended timeframe for professional follow-up"
}}

Ensure all recommendations are specific to {disease}. Avoid generic advice.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, priority_level, immediate_actions, "
            "recommended_specialists, diagnostic_tests, monitoring_plan, "
            "when_to_seek_emergency, follow_up_timeline"
        )
