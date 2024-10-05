from django.contrib import admin
from .models import Card, CardOffer, CardPurchase

# Register your models here.

admin.site.register(Card)
admin.site.register(CardOffer)
admin.site.register(CardPurchase)
