from django.contrib import admin
from .models import Card, CardOffer, CardPurchase, UserOffer, ShippingData

# Register your models here.

admin.site.register(Card)
admin.site.register(CardOffer)
admin.site.register(CardPurchase)
admin.site.register(UserOffer)
admin.site.register(ShippingData)

