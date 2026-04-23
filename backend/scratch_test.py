from dotenv import load_dotenv
load_dotenv()
from ml.openrouter_service import openrouter_service

def test():
    test_input = "Manual: I have a mild headache and feel a little bit of fever and some anxiety_and_nervousness but also super_fast_brain (not a symptom).\\nReport: None"
    print("Testing extraction...")
    res = openrouter_service.extract_validated_symptoms(test_input)
    print("Result:", res)

if __name__ == "__main__":
    test()
