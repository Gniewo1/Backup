from django.db import models
from users.models import CustomUser
from django.conf import settings

# Create your models here.

class Card(models.Model):
    name = models.CharField(max_length=100) 
    image = models.ImageField(upload_to='card_images/')  

    def __str__(self):
        return self.name



## Model for create auctions
class CardOffer(models.Model): 
    OFFER_TYPES = [
        ('buy_now', 'Buy Now'),
        ('auction', 'Auction'),
        ('buy_now_and_auction', 'Buy Now and Auction'),
    ]

    card = models.ForeignKey(Card,on_delete=models.CASCADE, related_name='offers')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    offer_type = models.CharField(max_length=20, choices=OFFER_TYPES)
    buy_now_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    auction_start_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    auction_end_date = models.DateTimeField(null=True, blank=True)
    front_image = models.ImageField(upload_to='card_offer_images/', null=True, blank=True)
    back_image = models.ImageField(upload_to='card_offer_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.seller.username} offers {self.card.name} for {self.created_at}"



## Model for offers made by users
class UserOffer(models.Model): 
    card_offer = models.ForeignKey(CardOffer, on_delete=models.CASCADE, related_name='user_offers')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_offers')
    offer_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Offer by {self.buyer.username} for {self.card_offer.card.name} - {self.offer_price}"




class CardPurchase(models.Model):
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='purchases')
    card_offer = models.ForeignKey(CardOffer, on_delete=models.CASCADE, related_name='purchases')
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    street = models.CharField(max_length=150)
    house_number = models.CharField(max_length=10)
    apartment_number = models.CharField(max_length=10, blank=True, null=True)  # Optional
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.buyer.username} purchased {self.card_offer.card.name}"