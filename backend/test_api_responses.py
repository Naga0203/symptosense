import os
import sys
import django

# Setup Django Environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.test import RequestFactory
from rest_framework.test import APIRequestFactory
from rest_framework import status

from api.views.assessment_views import ocr_extract_view

def test_api_extraction():
    factory = APIRequestFactory()
    data = {
        'symptoms': 'headache, fever, some_invalid_symptom',
        'user_id': 'test_user'
    }
    request = factory.post('/api/assessment/extract/', data, format='json')
    
    print("\n=== Testing API Response (ocr_extract_view) ===")
    try:
        response = ocr_extract_view(request)
        print("Status Code:", response.status_code)
        print("Response Data:", response.data)
        
        if response.status_code == 200:
            print("Validation Check Passed!")
        else:
            print("Validation Check Failed.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api_extraction()
