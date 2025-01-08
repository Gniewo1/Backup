from celery import shared_task
from django.utils.timezone import now
from .models import CardOffer

@shared_task
def deactivate_expired_offers():
    expired_offers = CardOffer.objects.filter(is_active=True, auction_end_date__lt=now())
    expired_offers.update(is_active=False)