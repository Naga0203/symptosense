import os
import io
import tempfile
import numpy as np
import cv2
from PIL import Image
from doctr.io import DocumentFile
from doctr.models import ocr_predictor
from typing import List, Union

class OCRService:
    def __init__(self):
        """
        Initialize the DocTR OCR Engine with specific MobileNetV3 architectures.
        """
        print("Initializing DocTR OCR Engine...")
        
        # Load specific pretrained models
        self.model = ocr_predictor(
            det_arch='db_mobilenet_v3_large',
            reco_arch='crnn_mobilenet_v3_small',
            pretrained=True
        )
        
        # Enable GPU if available
        try:
            import torch
            if torch.cuda.is_available():
                print("CUDA detected. Using GPU for OCR.")
                self.model = self.model.to("cuda")
        except ImportError:
            pass

        # Set to evaluation mode
        self.model.eval()

    def preprocess_image(self, pil_img: Image.Image) -> np.ndarray:
        """
        Resize image to a maximum dimension of 900 while maintaining aspect ratio.
        """
        img = np.array(pil_img)
        h, w = img.shape[:2]

        scale = 900 / max(h, w)
        if scale < 1:
            img = cv2.resize(img, (int(w * scale), int(h * scale)))

        return img

    def _extract_clean_text(self, result) -> dict:
        """
        Extracts words into text and calculates the average confidence score.
        Returns a dictionary with 'text' and 'average_confidence'.
        """
        pages = result.export()['pages']
        full_text = []
        confidences = []

        for page in pages:
            for block in page['blocks']:
                for line in block['lines']:
                    for word in line['words']:
                        full_text.append(word['value'])
                        confidences.append(word['confidence'])
                    full_text.append("\n") # Line break

        avg_conf = np.mean(confidences) if confidences else 0
        return {
            'text': " ".join(full_text).replace(" \n ", "\n").strip(),
            'average_confidence': float(avg_conf)
        }

    def process_file(self, file_data: bytes, filename: str) -> dict:
        """
        Unified processing for PDF and Images using DocTR.
        Includes a quality check based on OCR confidence scores.
        """
        ext = filename.lower().split('.')[-1]
        
        # Create a temporary file to hold the document
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            if ext == 'pdf':
                tmp.write(file_data)
            else:
                img = Image.open(io.BytesIO(file_data)).convert("RGB")
                processed_img = self.preprocess_image(img)
                success, encoded_image = cv2.imencode(f".{ext}", processed_img)
                if success:
                    tmp.write(encoded_image)
                else:
                    tmp.write(file_data)
            
            tmp_path = tmp.name

        try:
            if ext == 'pdf':
                doc = DocumentFile.from_pdf(tmp_path)
            else:
                doc = DocumentFile.from_images(tmp_path)

            result = self.model(doc)
            extraction = self._extract_clean_text(result)
            
            # Quality Check: Threshold of 60%
            if extraction['average_confidence'] < 0.6:
                return {
                    'error': 'Low scan quality detected. Please upload a clearer image or a high-quality PDF for accurate analysis.',
                    'text': extraction['text'],
                    'quality_low': True
                }

            return extraction

        except Exception as e:
            return {'error': f"OCR Error: {str(e)}"}
        
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

# Singleton instance
ocr_service = OCRService()
