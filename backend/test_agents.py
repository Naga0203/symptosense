import json
import time
from agents.orchestrator import medical_orchestrator

def run_test():
    predicted_disease = "Type 2 Diabetes"
    symptoms = "Patient complains of frequent urination, excessive thirst, and unexplained fatigue over the last 3 months."

    print(f"Testing the orchestrator with:")
    print(f"Predicted Disease: {predicted_disease}")
    print(f"Symptoms: {symptoms}")
    print("-" * 50)
    print("Running agents in parallel... (This might take a few moments)\n")

    start_time = time.time()
    
    # Run the orchestrator
    result = medical_orchestrator.run(disease=predicted_disease, symptoms=symptoms)
    
    elapsed = time.time() - start_time
    
    print(f"\nExecution completed in {elapsed:.2f} seconds.")
    print("-" * 50)
    print("RESULT:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    run_test()
