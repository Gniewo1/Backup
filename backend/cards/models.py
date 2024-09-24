from django.db import models
from users.models import CustomUser

# Create your models here.

class Card(models.Model):
    name = models.CharField(max_length=100) 
    image = models.ImageField(upload_to='card_images/')  

    def __str__(self):
        return self.name
    
class CardOffer(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_offers')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='card_offers')
    offer_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} offers {self.card.name} for {self.offer_price}"