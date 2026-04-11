from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from ml.ocr_service import ocr_service
from ml.disease_predictor import disease_predictor
from ml.openrouter_service import openrouter_service
from ml.firebase_service import firebase_service
from agents.orchestrator import medical_orchestrator
from datetime import datetime
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def ocr_extract_view(request):
    """
    Unified endpoint to handle medical report uploads and manual symptom input together.
    Returns extracted text and cleaned symptoms via OpenRouter.
    """
    file_obj = request.FILES.get('file')
    manual_symptoms = request.data.get('symptoms', '')
    
    if not file_obj and not manual_symptoms:
        return Response({'error': 'Either a report file or manual symptoms must be provided'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    extraction_warning = None
    extracted_text = ""
    ocr_symptoms = ""
    
    try:
        # 1. Handle File Upload if present
        if file_obj:
            file_bytes = file_obj.read()
            result = ocr_service.process_file(file_bytes, file_obj.name)
            
            if 'error' in result:
                if result.get('quality_low'):
                    extracted_text = result['text']
                    extraction_warning = result['error']
                else:
                    return Response({'error': result['error']}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            else:
                extracted_text = result['text']

        # 2. Extract/Clean Symptoms via OpenRouter
        # Merge manual and OCR context for a clean list
        input_for_extraction = f"Manual: {manual_symptoms}\nReport: {extracted_text}"
        
        try:
            # We use the same service but with a "cleanup" flavor
            analysis = openrouter_service.analyze_medical_condition(manual_symptoms, extracted_text)
            # We only need a summary list for the 'extracted_symptoms' field for now
            # but we can also return the whole analysis if the user wants it early.
            ocr_symptoms = analysis.get('condition_analysis', '')[:200] # Just a snippet
        except Exception as llm_error:
            print(f"LLM Extraction failed: {llm_error}")
            ocr_symptoms = manual_symptoms

        return Response({
            'raw_text': extracted_text,
            'extracted_symptoms': ocr_symptoms,
            'warning': extraction_warning,
            'message': 'Data processed successfully'
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def diagnosis_view(request):
    """
    Endpoint to get disease prediction and multi-agent AI analysis.
    
    Flow:
      1. NN Model predicts disease from symptoms
      2. Predicted disease is dispatched to 4 LangChain agents in parallel:
         - Recommendation Agent       (Gemma 3 27B)
         - Treatment Exploration Agent (GPT-4.1-nano)
         - Clinical Guidelines Agent   (Llama 4 Maverick)
         - Lifestyle & Diet Agent      (Microsoft Phi-4)
      3. Structured, disambiguated results returned to frontend
    """
    symptoms = request.data.get('symptoms')
    user_id = request.data.get('user_id', 'guest_user')
    
    if not symptoms:
        return Response({'error': 'Symptoms required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ── Step 1: ML Prediction (Neural Network) ─────────────────────
        prediction, confidence = disease_predictor.predict(symptoms)
        
        # ── Step 2: Multi-Agent Analysis (4 LangChain Agents) ──────────
        agent_analysis = medical_orchestrator.run(
            disease=prediction,
            symptoms=symptoms,
        )
        
        # ── Step 3: Save to History ────────────────────────────────────
        history_data = {
            'user_id': user_id,
            'symptoms': symptoms,
            'prediction': prediction,
            'confidence': float(confidence),
            'analysis': agent_analysis,
            'timestamp': datetime.now().isoformat(),
            'status': 'completed'
        }
        firebase_service.collection('history').add(history_data)

        return Response({
            'prediction': prediction,
            'confidence': float(confidence),
            'symptoms_analyzed': symptoms,
            'analysis': agent_analysis,
            'saved': True
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def report_insight_view(request):
    """
    Direct endpoint for report analysis (Insights Only).
    """
    file_obj = request.FILES.get('file')
    text_content = request.data.get('text', '')

    if not file_obj and not text_content:
        return Response({'error': 'No report data provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        report_text = text_content
        if file_obj:
            file_bytes = file_obj.read()
            ocr_result = ocr_service.process_file(file_bytes, file_obj.name)
            if 'error' in ocr_result and not ocr_result.get('quality_low'):
                return Response({'error': ocr_result['error']}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            report_text = ocr_result['text']

        insights = openrouter_service.analyze_report_insights(report_text)
        
        return Response({
            'insights': insights,
            'raw_text_length': len(report_text),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_diseases_view(request):
    """
    Returns the list of diseases supported by the AI model.
    """
    try:
        classes = disease_predictor.label_encoder.classes_.tolist()
        return Response({'diseases': sorted(classes)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_assessment_history(request):
    """
    Retrieve assessment history for a specific user.
    """
    user_id = request.query_params.get('user_id', 'guest_user')
    
    try:
        history_stream = firebase_service.collection('history').where('user_id', '==', user_id).stream()
        history = [doc.to_dict() for doc in history_stream]
        
        # Sort by timestamp
        history.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return Response(history)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
