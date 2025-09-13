from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import UserProfile
import requests
import json

@api_view(['GET'])
@permission_classes([AllowAny])
def auth_status(request):
    if request.user.is_authenticated:
        try:
            profile = UserProfile.objects.get(user=request.user)
            roll_number = profile.roll_number
            year = profile.year
            branch = profile.branch
            degree = profile.degree
        except UserProfile.DoesNotExist:
            roll_number = None
            year = None
            branch = None
            degree = None
            
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'roll_number': roll_number,
                'year': year,
                'branch': branch,
                'degree': degree,
            }
        })
    return Response({'authenticated': False})

@api_view(['POST'])
@permission_classes([AllowAny])
def get_sso_user_data(request):
    sessionkey = request.data.get('sessionkey') or request.data.get('accessid')
    
    if not sessionkey:
        return Response({"error": "Missing sessionkey"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        sso_payload = {"id": sessionkey}
        
        response = requests.post(
            "http://sso.tech-iitb.org/project/getuserdata",
            json=sso_payload,
            timeout=10
        )
        
        data = response.json()

        if response.status_code == 200 and 'roll' in data and 'name' in data:
            # Normalize roll number
            raw_roll = data['roll']
            normalized_roll = raw_roll.replace(' ', '').lower()
            
            # Extract data from SSO response
            year = str(data.get('passing_year', ''))
            branch = data.get('department', '')
            degree = data.get('degree', '')
            
            # Create/get user and login
            user, user_created = User.objects.get_or_create(
                username=normalized_roll,
                defaults={
                    'email': f"{normalized_roll}@iitb.ac.in",
                    'first_name': data['name'].split()[0],
                    'last_name': ' '.join(data['name'].split()[1:]) if len(data['name'].split()) > 1 else '',
                }
            )
            
            profile, profile_created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'roll_number': normalized_roll,
                    'year': year,
                    'branch': branch,
                    'degree': degree
                }
            )
            
            # Update existing profile with latest SSO data
            if not profile_created:
                profile.year = year or profile.year
                profile.branch = branch or profile.branch
                profile.degree = degree or profile.degree
                profile.save()
            
            login(request, user)
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to fetch user data"}, status=response.status_code)

    except requests.exceptions.RequestException as e:
        return Response({"error": "Failed to connect to SSO server"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    return Response({'csrfToken': get_token(request)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})