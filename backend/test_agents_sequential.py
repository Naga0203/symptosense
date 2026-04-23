import sys
import os
import time
from typing import Dict, Any

# Add the backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

# Load env vars before importing agents
from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, '.env'))

from agents.orchestrator import medical_orchestrator

def test_parallel_execution():
    disease = "Pneumonia"
    symptoms = "Cough, fever, difficulty breathing, chest pain"
    
    print(f"Testing parallel execution for: {disease}")
    print("-" * 50)
    
    start_time = time.time()
    response = medical_orchestrator.run(disease, symptoms)
    end_time = time.time()
    
    total_time = round(end_time - start_time, 2)
    orchestrator_time = response.get('processing_time_seconds', 0)
    
    print(f"\nResponse Status: {response.get('status')}")
    print(f"Total Wall Clock Time: {total_time}s")
    print(f"Orchestrator Reported Time: {orchestrator_time}s")
    
    print("\nAgent Status:")
    for agent_name, result in response.get('agents', {}).items():
        status = "SUCCESS" if "error" not in result else "FAILED"
        model = result.get('model_used', 'unknown')
        print(f"  - {agent_name}: {status} (Model: {model})")
        if "error" in result:
            print(f"    Error: {result['error']}")

if __name__ == "__main__":
    test_parallel_execution()
