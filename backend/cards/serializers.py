from rest_framework import serializers
from .models import Card, CardOffer, CardPurchase

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = [ 'id', 'name', 'image']


class CardOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardOffer
        fields = '__all__'
        read_only_fields = ['seller', 'created_at', 'is_active']
    
class CardPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardPurchase
        fields = ['buyer', 'card_offer', 'city', 'zip_code', 'street', 'house_number', 'apartment_number']
        