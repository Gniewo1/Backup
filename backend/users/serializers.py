from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TestClass, VerificationRequest

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

class VerificationRequestSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = VerificationRequest
        fields = ['id', 'user', 'request_date', 'status']
        # read_only_fields = ['id', 'username', 'request_date', 'status', 'updated_at']