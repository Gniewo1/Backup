from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, TestSerializer, VerificationRequestSerializer, VerifyingUserSerializer
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from .models import TestClass, VerificationRequest, CustomUser
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.mail import send_mail
import logging
logger = logging.getLogger(__name__)


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
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def VerifyingUser(request):
    # Extract the user ID from the request data
    user_id = request.data.get('id')
    user = get_object_or_404(CustomUser, id=user_id)
    serializer = VerifyingUserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerificationRequestUpdate(viewsets.ModelViewSet):
    queryset = VerificationRequest.objects.all()
    serializer_class = VerificationRequestSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Allow partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def send_verification_email(request):
    try:
        # Extract data from the request
        data = request.data
        subject = "Verification"
        message = data.get('message')
        recipient_list = data.get('recipient_list')

        # Log the received data for debugging
        logger.info(f"Received data: Subject: {subject}, Message: {message}, Recipients: {recipient_list}")

        # Basic validation
        if not subject or not message or not recipient_list:
            return JsonResponse({'error': 'All fields (subject, message, recipients) are required.'}, status=400)

        # Send the email
        send_mail(
            subject,
            message,
            'your_email@gmail.com',  # Replace this with your actual sender email
            recipient_list,
            fail_silently=False,
        )

        # Log success
        logger.info("Email sent successfully")
        return JsonResponse({'message': 'Email sent successfully.'}, status=200)

    except Exception as e:
        # Log the error details
        logger.error(f"Error sending email: {e}")
        return JsonResponse({'error': str(e)}, status=500)