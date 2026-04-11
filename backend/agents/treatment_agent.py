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
    DEFAULT_MODEL = "google/gemma-4-31b-it:free"

    DISCLAIMER = (
        "⚠️ TREATMENT DISCLAIMER: The treatment information provided is AI-generated "
        "and based on general medical knowledge. Treatment efficacy varies by individual. "
        "Do NOT start, stop, or modify any treatment without direct supervision from "
        "your physician. Self-medication can be dangerous and potentially life-threatening."
    )

    def _build_system_prompt(self) -> str:
        websites = [
            'pubmed.ncbi.nlm.nih.gov', 'ncbi.nlm.nih.gov', 'who.int', 'cdc.gov',
            'nih.gov', 'mayoclinic.org', 'nejm.org', 'thelancet.com', 'bmj.com',
            'jamanetwork.com', 'medlineplus.gov', 'healthline.com', 'webmd.com',
            'clevelandclinic.org', 'hopkinsmedicine.org', 'health.harvard.edu',
            'nhs.uk', 'cancer.gov', 'heart.org', 'diabetes.org', 'arthritis.org'
        ]
        website_list = "\n- ".join(websites)
        
        return (
            "You are an expert clinical pharmacologist and integrative medicine strategist. "
            "Your role is to explore all viable treatment pathways for a diagnosed condition, "
            "covering Allopathy (English medicine/standard care), Ayurvedic medicine, and "
            "Homeopathy where applicable.\n\n"
            "You must use your internal knowledge base informed by the following authoritative sources:\n"
            f"- {website_list}\n\n"
            "Present information objectively, explaining the mechanism of action for each system. "
            "Always include evidence-based standard care (Allopathy) alongside complementary "
            "approaches. You never prescribe or recommend specific dosages.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no extra text."
        )

    def _build_user_prompt(self, disease: str, symptoms: str) -> str:
        return """
A neural network model has predicted the following disease:

**Predicted Disease:** {disease}
**Patient Symptoms:** {symptoms}

Explore comprehensive treatment options across Allopathy, Ayurveda, and Homeopathy. Return your analysis in the following JSON format:

{{
    "disease": "{disease}",
    "treatment_overview": "Comprehensive overview of the treatment landscape across different medical systems",
    "allopathy": [
        {{
            "treatment_name": "Standard medication or procedure",
            "type": "Medication / Surgery / Standard Care",
            "description": "Mechanism of action and standard use",
            "common_side_effects": ["Side effect 1", "Side effect 2"]
        }}
    ],
    "ayurvedic_treatments": [
        {{
            "formulation_name": "Name of herb or formulation",
            "treatment_type": "Panchakarma / Herb / Lifestyle modification",
            "description": "Ayurvedic perspective and action",
            "key_ingredients": ["Herb 1", "Herb 2"]
        }}
    ],
    "homeopathy": [
        {{
            "remedy_name": "Name of the homeopathic remedy",
            "indication": "Specific symptom cluster it targets",
            "description": "Background on the remedy's use for this condition"
        }}
    ],
    "emerging_therapies": [
        {{
            "therapy_name": "Name of emerging treatment",
            "research_stage": "Clinical Trial Phase / Research Status",
            "description": "Brief description of the therapy"
        }}
    ],
    "treatment_considerations": "Integrated view of combining these approaches, caution markers, and professional advice",
    "contraindications": "Key contraindications across all mentioned systems"
}}

Ensure each section is populated with relevant data based on global clinical standards and traditional medical knowledge.
"""

    def _get_output_schema_description(self) -> str:
        return (
            "JSON with keys: disease, treatment_overview, allopathy, "
            "ayurvedic_treatments, homeopathy, emerging_therapies, "
            "treatment_considerations, contraindications"
        )
