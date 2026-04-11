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
    DEFAULT_MODEL = "google/gemma-4-31b-it:free"

    DISCLAIMER = (
        "⚠️ CLINICAL GUIDELINES DISCLAIMER: The guidelines presented are AI-synthesized "
        "from general medical literature and may not reflect the most current updates. "
        "Clinical guidelines change frequently — always verify with official sources such as "
        "WHO, CDC, NICE, or your country's national health authority. Your physician should "
        "interpret guidelines in the context of YOUR specific clinical situation."
    )

    def _build_system_prompt(self) -> str:
        return (
            "You are a clinical guidelines expert with deep knowledge of international "
            "medical standards from organizations like WHO, NICE, AHA, NCCN, and IDSA. "
            "Your role is to summarize the standard-of-care guidelines, staging criteria, "
            "and key clinical protocols for diagnosed conditions. You cite guideline bodies "
            "where appropriate.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
A neural network model has predicted the following disease:

**Predicted Disease:** {disease}
**Patient Symptoms:** {symptoms}

Provide clinical guidelines and standard-of-care information in the following JSON format:

{{
    "disease": "{disease}",
    "icd_code": "ICD-10 code if known (e.g., J18.9 for Pneumonia)",
    "classification": "How this disease is classified/staged",
    "diagnostic_criteria": [
        "Criterion 1 for definitive diagnosis",
        "Criterion 2 for definitive diagnosis"
    ],
    "standard_of_care": {{
        "mild_cases": "Treatment protocol for mild presentations",
        "moderate_cases": "Treatment protocol for moderate presentations",
        "severe_cases": "Treatment protocol for severe presentations"
    }},
    "guideline_sources": [
        {{
            "organization": "Name of guideline body (e.g., WHO, NICE, AHA)",
            "guideline_name": "Name of the specific guideline",
            "key_recommendation": "Primary recommendation from this guideline"
        }}
    ],
    "risk_factors": ["Risk factor 1", "Risk factor 2"],
    "prognosis": "General prognosis and expected outcomes with proper treatment",
    "prevention": "Preventive measures to reduce risk of occurrence or recurrence",
    "red_flags": ["Warning sign 1 that requires urgent attention", "Warning sign 2"]
}}

Ensure all guidelines are evidence-based. Cite specific organizations where possible.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, icd_code, classification, diagnostic_criteria, "
            "standard_of_care, guideline_sources, risk_factors, prognosis, prevention, red_flags"
        )
