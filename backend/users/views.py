from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, TestSerializer, VerifyingUserSerializer
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from .models import TestClass, CustomUser, VerificationCode
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
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
        'is_verified': user.is_verified,
    }
    return Response(data)


@api_view(['GET'])
def get_items(request):
    items = TestClass.objects.all()  # Fetch all items from the database
    serializer = TestSerializer(items, many=True)
    return Response(serializer.data)



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
    

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_user(request):
    code = request.data.get('code')
    user_id = request.data.get('user_id')  
    print(code)
    print(user_id)

    try:
        code = VerificationCode.objects.get(user=user_id, code=code)
        print(code)
        user = User.objects.get(id=user_id)
        user.is_verified = True
        # user.verification_code = None 
        user.save()
        code.delete()
        return Response({'message': 'Verification successful'}, status=status.HTTP_200_OK)
    except VerificationCode.DoesNotExist:
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)