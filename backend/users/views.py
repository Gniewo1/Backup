from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, TestSerializer, VerificationRequestSerializer, VerifyingUserSeriaziler
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from django.contrib.auth.models import User
# from django.contrib.auth.decorators import login_required
from .models import TestClass, VerificationRequest, CustomUser
from django.shortcuts import get_object_or_404


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": {
                "username": user.username,
                "email": user.email
            }
        })
    
class LoginAPI(KnoxLoginView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)
    
class UserCheckView(APIView):
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user  # Get the currently logged-in user
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_admin':user.is_staff or user.is_superuser,
        'is_verified': user.verified,
    }
    return Response(data)


@api_view(['GET'])
def get_items(request):
    items = TestClass.objects.all()  # Fetch all items from the database
    serializer = TestSerializer(items, many=True)
    return Response(serializer.data)


class VerificationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Create a verification request for the authenticated user
        user = request.user
        # Check if a request already exists
        if VerificationRequest.objects.filter(user=user, status='pending').exists():
            return Response({"detail": "A verification request is already pending."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new request
        verification_request = VerificationRequest.objects.create(user=user)
        serializer = VerificationRequestSerializer(verification_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class ShowVerificationRequests(APIView):
    permission_classes = [IsAdminUser]  # Ensure only admins can access this

    def get(self, request, *args, **kwargs):
        pending_requests = VerificationRequest.objects.filter(status='pending')
        serializer = VerificationRequestSerializer(pending_requests, many=True)
        print(serializer.data)  # This will help you see the serialized output
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def VerifyingUser(request):
    # Extract the user ID from the request data
    user_id = request.data.get('id')
    user = get_object_or_404(CustomUser, id=user_id)
    serializer = VerifyingUserSeriaziler(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)