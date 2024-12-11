from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# User = get_user_model()

class CustomUser(AbstractUser):
    verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)


class TestClass(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)


class VerificationRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,  related_name='verification_requests')
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    updated_at = models.DateTimeField(auto_now=True)
    reason_for_rejection = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Verification Request from {self.user.username} - {self.get_status_display()}'

    class Meta:
        verbose_name = 'Verification Request'
        verbose_name_plural = 'Verification Requests'
        ordering = ['-request_date']