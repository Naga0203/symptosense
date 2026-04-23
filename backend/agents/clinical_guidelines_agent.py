"""
Agent 3: Clinical Guidelines Agent
────────────────────────────────────
Provides evidence-based clinical guidelines, staging information,
and standard-of-care protocols for the predicted disease.

Model : meta-llama/llama-4-maverick  (configurable via CLINICAL_GUIDELINES_AGENT_MODEL)
API Key: CLINICAL_GUIDELINES_AGENT_API_KEY
"""

from .base_agent import BaseMedicalAgent


class ClinicalGuidelinesAgent(BaseMedicalAgent):
    AGENT_NAME = "Clinical Guidelines Agent"
    ENV_API_KEY = "CLINICAL_GUIDELINES_AGENT_API_KEY"
    ENV_MODEL = "CLINICAL_GUIDELINES_AGENT_MODEL"
    DEFAULT_MODEL = "minimax/minimax-m2.5:free"

    DISCLAIMER = (
        "⚠️ CLINICAL GUIDELINES DISCLAIMER: The guidelines presented are AI-synthesized "
        "from general medical literature and may not reflect the most current updates. "
        "Always verify with official sources such as WHO, CDC, NICE, or your country's national "
        "health authority. Your physician should interpret guidelines in the context of YOUR "
        "specific clinical situation."
    )

    def _build_system_prompt(self) -> str:
        return (
            "You are a clinical guidelines expert. Your role is to summarize the "
            "standard-of-care guidelines, staging criteria, and key clinical protocols "
            "for diagnosed conditions. Cite guideline bodies like WHO, NICE, or AHA.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
Provide clinical guidelines and standard-of-care for:
Predicted Disease: {disease}
Patient Symptoms: {symptoms}

Return a structured JSON response:
{{
    "disease": "{disease}",
    "icd_code": "ICD-10 code (e.g., J18.9)",
    "classification": "Classification or staging criteria for {disease}",
    "diagnostic_criteria": [
        "Key diagnostic criterion 1",
        "Key diagnostic criterion 2"
    ],
    "standard_of_care": {{
        "mild_cases": "Protocol for mild presentation",
        "moderate_cases": "Protocol for moderate presentation",
        "severe_cases": "Protocol for severe presentation"
    }},
    "guideline_sources": [
        {{
            "organization": "e.g., WHO, NICE",
            "guideline_name": "Specific guideline title",
            "key_recommendation": "Main takeaway"
        }}
    ],
    "risk_factors": ["risk factor 1", "risk factor 2"],
    "prognosis": "Expected outcomes with proper care",
    "prevention": "Preventive measures",
    "red_flags": ["Critical warning signs for {disease}"]
}}

Ensure all information is evidence-based and specific to {disease}.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, icd_code, classification, diagnostic_criteria, "
            "standard_of_care, guideline_sources, risk_factors, prognosis, prevention, red_flags"
        )
