import json
import time
import os
import sys
from dotenv import load_dotenv

# Force UTF-8 for Windows Terminal
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

print("Diagnostic: Starting test script...")
load_dotenv()

from agents.recommendation_agent import RecommendationAgent
from agents.treatment_agent import TreatmentExplorationAgent
from agents.clinical_guidelines_agent import ClinicalGuidelinesAgent
from agents.lifestyle_diet_agent import LifestyleDietAgent

def run_test_sequential():
    predicted_disease = "Type 2 Diabetes"
    symptoms = "Patient complains of frequent urination, excessive thirst, and unexplained fatigue over the last 3 months."

    print("Diagnostic: Initializing agents...")
    
    agent_configs = [
        ("Recommendation", RecommendationAgent),
        ("Treatment", TreatmentExplorationAgent),
        ("Clinical Guidelines", ClinicalGuidelinesAgent),
        ("Lifestyle & Diet", LifestyleDietAgent)
    ]

    print(f"Testing agents SEQUENTIALLY with free models...")
    print(f"Predicted Disease: {predicted_disease}\n")

    full_results = {
        "predicted_disease": predicted_disease,
        "symptoms": symptoms,
        "agents": {}
    }

    for name, AgentClass in agent_configs:
        print(f"--- Running {name} Agent...")
        try:
            agent = AgentClass()
            print(f"    Agent initialized (Key: {agent.ENV_API_KEY[:5]}..., Model: {agent.DEFAULT_MODEL})")
            start = time.time()
            res = agent.run(disease=predicted_disease, symptoms=symptoms)
            full_results["agents"][name] = res
            print(f"    Success in {time.time() - start:.2f}s")
            if "error" in res:
                print(f"    MODEL ERROR: {res['error']}")
        except Exception as e:
            print(f"    EXECUTION ERROR in {name}: {str(e)}")
            full_results["agents"][name] = {"error": str(e)}

    print("\n" + "="*50)
    print("FINAL SEQUENTIAL RESULTS:")
    # We use json.dumps with ensure_ascii=False to preserve UTF-8
    print(json.dumps(full_results, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    run_test_sequential()
