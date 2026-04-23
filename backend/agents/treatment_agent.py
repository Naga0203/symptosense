"""
Agent 2: Treatment Exploration Agent
──────────────────────────────────────
Explores comprehensive treatment options including medications,
procedures, and emerging therapies for the predicted disease.

Model : openai/gpt-4.1-nano  (configurable via TREATMENT_AGENT_MODEL)
API Key: TREATMENT_AGENT_API_KEY
"""

from .base_agent import BaseMedicalAgent


class TreatmentExplorationAgent(BaseMedicalAgent):
    AGENT_NAME = "Treatment Exploration Agent"
    ENV_API_KEY = "TREATMENT_AGENT_API_KEY"
    ENV_MODEL = "TREATMENT_AGENT_MODEL"
    DEFAULT_MODEL = "minimax/minimax-m2.5:free"

    MEDICAL_SOURCES = [
        'pubmed.ncbi.nlm.nih.gov', 'ncbi.nlm.nih.gov', 'who.int', 'cdc.gov',
        'nih.gov', 'mayoclinic.org', 'nejm.org', 'thelancet.com', 'bmj.com',
        'jamanetwork.com', 'medlineplus.gov', 'healthline.com', 'webmd.com',
        'clevelandclinic.org', 'hopkinsmedicine.org', 'health.harvard.edu',
        'nhs.uk', 'cancer.gov', 'heart.org', 'diabetes.org', 'arthritis.org'
    ]

    DISCLAIMER = (
        "⚠️ TREATMENT DISCLAIMER: The treatment information provided is AI-generated "
        "and based on general medical knowledge. Treatment efficacy varies by individual. "
        "Do NOT start, stop, or modify any treatment without direct supervision from "
        "your physician. Self-medication can be dangerous and potentially life-threatening."
    )

    def _build_system_prompt(self) -> str:
        website_list = "\n- ".join(self.MEDICAL_SOURCES)
        
        return (
            "You are an expert clinical pharmacologist and integrative medicine strategist. "
            "Your role is to explore all viable treatment pathways for a diagnosed condition, "
            "covering Allopathy (standard care), Ayurvedic medicine, and Homeopathy.\n\n"
            "Use your internal knowledge informed by authoritative sources like:\n"
            f"{website_list}\n\n"
            "Present information objectively. Always include evidence-based standard care (Allopathy) "
            "alongside complementary approaches. NEVER recommend specific dosages.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
Analyze the treatment landscape for the following:
Predicted Disease: {disease}
Patient Symptoms: {symptoms}

Return a comprehensive analysis in JSON format with the following structure:
{{
    "disease": "{disease}",
    "treatment_overview": "Summary of the overall treatment strategy",
    "allopathy": [
        {{
            "treatment_name": "Specific medication or procedure name",
            "type": "Category (e.g., Antibiotic, Surgery)",
            "description": "How it works and when it is used",
            "common_side_effects": ["side effect 1", "side effect 2"]
        }}
    ],
    "ayurvedic_treatments": [
        {{
            "formulation_name": "Herb or formulation name",
            "treatment_type": "Category (e.g., Herb, Lifestyle)",
            "description": "Ayurvedic mechanism of action",
            "key_ingredients": ["ingredient 1", "ingredient 2"]
        }}
    ],
    "homeopathy": [
        {{
            "remedy_name": "Remedy name",
            "indication": "Symptoms it targets",
            "description": "Background on its use for this condition"
        }}
    ],
    "emerging_therapies": [
        {{
            "therapy_name": "New treatment name",
            "research_stage": "e.g., Clinical Trial Phase II",
            "description": "Brief summary of the therapy"
        }}
    ],
    "treatment_considerations": "Integrated advice and caution markers",
    "contraindications": "Key warning signs and interactions to avoid"
}}

Ensure all fields are populated with data specific to {disease}. Do not return generic placeholder text.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, treatment_overview, allopathy, "
            "ayurvedic_treatments, homeopathy, emerging_therapies, "
            "treatment_considerations, contraindications"
        )
