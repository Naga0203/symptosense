from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth
from django.contrib.auth.models import User
from ml.firebase_service import firebase_service

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Registers a new user in Firebase Auth and locally in Django.
    Expected data: { email, password, username (optional) }
    """
    email = request.data.get('email')
    password = request.data.get('password')
    username = request.data.get('username', email)

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # 1. Create user in Firebase
        firebase_user = auth.create_user(
            email=email,
            password=password
        )
        uid = firebase_user.uid

        # 2. Create local Django user
        django_user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': username or email}
        )
        
        # 3. Initialize Firestore profile (Default Schema)
        if firebase_service.db:
            user_ref = firebase_service.db.collection('users').document(uid)
            user_ref.set({
                'email': email,
                'uid': uid,
                'createdAt': auth.datetime.datetime.now(),
                'role': 'user'
            })

        return Response({
            'message': 'User registered successfully',
            'uid': uid,
            'email': email
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def profile_view(request):
    """
    Fetch or Update user profile data in Firestore.
    """
    user_id = request.data.get('user_id') or request.query_params.get('user_id')
    
    if not user_id:
        return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)

    user_ref = firebase_service.db.collection('users').document(user_id)

    if request.method == 'GET':
        doc = user_ref.get()
        profile_data = doc.to_dict() if doc.exists else {
            'fullName': 'Health Explorer',
            'email': 'guest@example.com',
            'role': 'guest',
            'bloodGroup': 'Pending'
        }
        return Response({'profile': profile_data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = request.data.copy()
        if 'user_id' in data: del data['user_id']
        
        user_ref.set(data, merge=True)
        return Response({'message': 'Profile updated successfully', 'profile': data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_user(request):
    """
    Manual sync endpoint. Requires Bearer Token (already verified by FirebaseAuthentication middleware).
    Returns the current user's profile info.
    """
    user = request.user
    
    # Check Firestore for profile if needed
    profile_data = {}
    if firebase_service.db:
        # Usually UID is stored in some way. In our auth class, we might want to attach UID to request.
        # For now, let's assume we can fetch by email if that's what we synced.
        docs = firebase_service.db.collection('users').where('email', '==', user.email).limit(1).get()
        if docs:
            profile_data = docs[0].to_dict()

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'profile': profile_data
    })
