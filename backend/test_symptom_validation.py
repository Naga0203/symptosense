import os
import sys
from dotenv import load_dotenv

# Add the current directory to sys.path to allow imports from local packages
sys.path.append(os.getcwd())

load_dotenv()

from ml.openrouter_service import openrouter_service

def run_test(case_name, user_input):
    print(f"\n=== Case: {case_name} ===")
    print(f"Input: {user_input}")
    try:
        result = openrouter_service.extract_validated_symptoms(user_input)
        print("Response Status:", result.get('status'))
        print("Valid Symptoms:", result.get('valid_symptoms'))
        print("Invalid Symptoms:", result.get('invalid_symptoms'))
        print("Predicted Symptoms:", result.get('predicted_symptoms'))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Case 1: Only Valid
    run_test("Purely Valid", "I have a headache and some fever")
    
    # Case 2: Mixed
    run_test("Mixed Valid/Invalid", "headache, chest_tightness, and my brain feels like a marshmallow")
    
    # Case 3: Purely Invalid
    run_test("Purely Invalid", "Today is a sunny day for a walk in the park")
