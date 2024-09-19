from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, TestSerializer
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import TestClass


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
    

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def current_user(request):
#     user = request.user
#     return Response({'username': user.username})

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