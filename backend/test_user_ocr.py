import os
import sys
from dotenv import load_dotenv
load_dotenv()

# Add the backend to sys.path to import our services
sys.path.append(os.getcwd())

from ml.ocr_service import ocr_service

def test_ocr():
    file_path = r"E:\Downloads\lipid-profile-test-report-format-example-sample-template-drlogy-lab-report.webp"
    
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    print(f"Processing: {file_path}...")
    try:
        with open(file_path, 'rb') as f:
            file_bytes = f.read()
        
        extracted_text = ocr_service.process_file(file_bytes, os.path.basename(file_path))
        
        print("\n--- Extracted Text ---")
        print(extracted_text)
        print("----------------------")
        
        # Write to a file for audit
        with open("ocr_test_output.txt", "w", encoding="utf-8") as out:
            out.write(extracted_text)
        print("\nExtracted text saved to backend/ocr_test_output.txt")
        
    except Exception as e:
        print(f"OCR failed: {str(e)}")

if __name__ == "__main__":
    test_ocr()
