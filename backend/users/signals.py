from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import VerificationCode

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_verification_code_and_send_email(sender, instance, created, **kwargs):
    if created:  # Only for new users
        # Create the verification code
        verification_code = VerificationCode.objects.create(user=instance)
        
        # Send email with the verification code
        send_mail(
            subject="Kod Weryfikacyjny",
            message=f"Dear {instance.username},\n\nTwój kod weryfikacyjny to: {verification_code.code}\n\nDziękuję za rejestrację!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=False,
        )