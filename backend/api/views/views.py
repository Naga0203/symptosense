from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np

from ml.firebase_service import firebase_service
from ml.prediction_service import prediction_service
from agents.agent_service import ai_service


@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'healthy',
        'services': {
            'ml_models': prediction_service.list_models(),
            'ai_agents': ai_service.list_agents(),
            'firebase': firebase_service.db is not None
        }
    })


@api_view(['GET', 'POST'])
def prediction_view(request):
    if request.method == 'GET':
        models = prediction_service.list_models()
        return Response({'models': models})
    
    if request.method == 'POST':
        action = request.data.get('action', 'predict')
        
        if action == 'train_regression':
            model_name = request.data.get('model_name')
            X = np.array(request.data.get('X'))
            y = np.array(request.data.get('y'))
            result = prediction_service.train_regression_model(
                model_name, X, y
            )
            return Response(result, status=status.HTTP_201_CREATED)
        
        elif action == 'train_classification':
            model_name = request.data.get('model_name')
            X = np.array(request.data.get('X'))
            y = np.array(request.data.get('y'))
            result = prediction_service.train_classification_model(
                model_name, X, y
            )
            return Response(result, status=status.HTTP_201_CREATED)
        
        elif action == 'predict':
            model_name = request.data.get('model_name')
            X = np.array(request.data.get('X')).reshape(1, -1)
            predictions = prediction_service.predict(model_name, X)
            return Response({'predictions': predictions.tolist()})
        
        elif action == 'predict_proba':
            model_name = request.data.get('model_name')
            X = np.array(request.data.get('X')).reshape(1, -1)
            probas = prediction_service.predict_proba(model_name, X)
            return Response({'probabilities': probas.tolist()})
        
        return Response(
            {'error': 'Invalid action'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'POST'])
def ai_agent_view(request):
    if request.method == 'GET':
        return Response({'agents': ai_service.list_agents()})
    
    if request.method == 'POST':
        action = request.data.get('action', 'create')
        
        if action == 'create':
            agent = ai_service.create_agent(
                name=request.data.get('name'),
                role=request.data.get('role'),
                goal=request.data.get('goal'),
                backstory=request.data.get('backstory', '')
            )
            return Response({
                'name': agent.name,
                'role': agent.role,
                'goal': agent.goal
            }, status=status.HTTP_201_CREATED)
        
        elif action == 'execute':
            agent_name = request.data.get('agent_name')
            task = request.data.get('task')
            context = request.data.get('context', {})
            
            agent = ai_service.get_agent(agent_name)
            if not agent:
                return Response(
                    {'error': f"Agent '{agent_name}' not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            result = agent.execute(task, context)
            return Response({'result': result})
        
        return Response(
            {'error': 'Invalid action'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'POST'])
def ai_workflow_view(request):
    if request.method == 'GET':
        return Response({'workflows': ai_service.list_workflows()})
    
    if request.method == 'POST':
        action = request.data.get('action', 'create')
        
        if action == 'create':
            workflow_name = request.data.get('name')
            agent_names = request.data.get('agents', [])
            ai_service.create_workflow(workflow_name, agent_names)
            return Response({
                'name': workflow_name,
                'agents': agent_names
            }, status=status.HTTP_201_CREATED)
        
        elif action == 'execute':
            workflow_name = request.data.get('name')
            task = request.data.get('task')
            context = request.data.get('context', {})
            
            try:
                results = ai_service.execute_workflow(
                    workflow_name, task, context
                )
                return Response({'results': results})
            except ValueError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(
            {'error': 'Invalid action'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def firebase_data_view(request, collection):
    if firebase_service.db is None:
        return Response(
            {'error': 'Firebase not configured'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    col = firebase_service.collection(collection)
    if col is None:
        return Response(
            {'error': 'Firebase not configured'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    doc_id = request.data.get('id')
    
    if request.method == 'GET':
        if doc_id:
            doc = col.document(doc_id).get()
            if doc:
                return Response(doc)
            return Response(
                {'error': 'Document not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        docs = col.stream()
        return Response({collection: docs})
    
    elif request.method == 'POST':
        data = {k: v for k, v in request.data.items() if k != 'id'}
        doc_id = col.add(data)
        return Response({'id': doc_id}, status=status.HTTP_201_CREATED)
    
    elif request.method == 'PUT':
        if not doc_id:
            return Response(
                {'error': 'Document ID required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {k: v for k, v in request.data.items() if k != 'id'}
        col.document(doc_id).update(data)
        return Response({'success': True})
    
    elif request.method == 'DELETE':
        if not doc_id:
            return Response(
                {'error': 'Document ID required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        col.document(doc_id).delete()
        return Response({'success': True})
