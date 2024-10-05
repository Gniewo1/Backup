from rest_framework import serializers
from .models import Card, CardOffer, CardPurchase

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = [ 'id', 'name', 'image']


class CardOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardOffer
        fields = ['card', 'offer_price'] 

    def create(self, validated_data):
        # Automatically set the user from the request context
        user = self.context['request'].user
        validated_data['user'] = user
        return CardOffer.objects.create(**validated_data)
    
class CardPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardPurchase
        fields = ['buyer', 'card_offer', 'city', 'zip_code', 'street', 'house_number', 'apartment_number']
        