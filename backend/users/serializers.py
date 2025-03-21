from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TestClass, CustomUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestClass
        fields = ['first_name', 'last_name']

# class VerificationRequestSerializer(serializers.ModelSerializer):
#     user = serializers.CharField(source='user.username', read_only=True)
#     user_id = serializers.IntegerField(source='user.id', read_only=True) 

#     status = serializers.ChoiceField(choices=VerificationRequest.STATUS_CHOICES)

#     class Meta:
#         model = VerificationRequest
#         fields = ['id', 'user', 'user_id', 'request_date', 'status']
   

class VerifyingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # Use your custom user model
        fields = ['is_verified']

