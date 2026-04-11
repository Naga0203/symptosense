import firebase_admin
from firebase_admin import auth
from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        id_token = auth_header.split(' ').pop()
        if not id_token:
            return None

        try:
            # Verify the token against Firebase
            decoded_token = auth.verify_id_token(id_token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid Firebase token: {str(e)}')

        uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        if not uid:
            raise exceptions.AuthenticationFailed('UID not found in token')

        # Sync with local Django User
        try:
            # We use email as a lookup first, then fallback to uid if email is empty
            if email:
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={'username': email, 'first_name': decoded_token.get('name', '')}
                )
            else:
                user, created = User.objects.get_or_create(
                    username=uid,
                    defaults={'first_name': decoded_token.get('name', 'Firebase User')}
                )
                
            # Optionally update local user metadata or profile link here
            return (user, None)
            
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'User sync failed: {str(e)}')
