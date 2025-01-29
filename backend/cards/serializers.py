from rest_framework import serializers
from .models import Card, CardOffer, CardPurchase, UserOffer

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = [ 'id', 'name', 'image']


class CardOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardOffer
        fields = '__all__'
        read_only_fields = ['seller', 'created_at', 'is_active']

class CardWinOfferSerializer(serializers.ModelSerializer):
    card = CardSerializer(read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    class Meta:
        model = CardOffer
        fields = '__all__'
        read_only_fields = ['seller', 'created_at', 'is_active', 'auction_current_price', 'front_image', 'bank_account_number']
    
class CardPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardPurchase
        fields = ['buyer', 'card_offer', 'city', 'zip_code', 'street', 'house_number', 'apartment_number']

class UserOfferSerializer(serializers.ModelSerializer):
    card_name = serializers.CharField(source="card_offer.card.name", read_only=True)

    class Meta:
        model = UserOffer
        fields = ['id', 'card_name', 'offer_price', 'created_at']
        