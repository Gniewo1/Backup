from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import random

# User = get_user_model()

class CustomUser(AbstractUser):
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)


class TestClass(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)



class VerificationCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6, default=random.randint(100000, 999999))

