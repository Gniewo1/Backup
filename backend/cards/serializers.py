from rest_framework import serializers
from .models import Card, CardOffer, CardPurchase, UserOffer, ShippingData

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = [ 'id', 'name', 'image']


# class CardOfferSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CardOffer
#         fields = '__all__'
#         read_only_fields = ['seller', 'created_at', 'is_active']
class CardOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardOffer
        fields = '__all__'
        read_only_fields = ['seller', 'created_at', 'is_active']

    def validate(self, data):
        offer_type = data.get('offer_type')

        # Dla 'buy_now' wymagamy buy_now_price
        if offer_type == 'buy_now' and not data.get('buy_now_price'):
            raise serializers.ValidationError({
                'buy_now_price': 'To pole jest wymagane dla oferty "Kup Teraz".'
            })

        # Dla 'auction' wymagamy auction_start_price i auction_current_price
        if offer_type == 'auction':
            if not data.get('auction_start_price'):
                raise serializers.ValidationError({
                    'auction_start_price': 'To pole jest wymagane dla aukcji.'
                })
            if not data.get('auction_current_price'):
                raise serializers.ValidationError({
                    'auction_current_price': 'To pole jest wymagane dla aukcji.'
                })

        # Dla obu trybów wymagamy wszystkich cen
        if offer_type == 'buy_now_and_auction':
            if not data.get('buy_now_price'):
                raise serializers.ValidationError({
                    'buy_now_price': 'To pole jest wymagane dla trybu "Kup Teraz i Aukcja".'
                })
            if not data.get('auction_start_price'):
                raise serializers.ValidationError({
                    'auction_start_price': 'To pole jest wymagane dla trybu "Kup Teraz i Aukcja".'
                })
            if not data.get('auction_current_price'):
                raise serializers.ValidationError({
                    'auction_current_price': 'To pole jest wymagane dla trybu "Kup Teraz i Aukcja".'
                })

        return data
    
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
        

class ShippingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingData
        fields = [
            "name",
            "surname",
            "card_offer",
            "city",
            "zip_code",
            "street",
            "house_number",
            "apartment_number",
            "delivery_completed",
        ]
        extra_kwargs = {
            "card_offer": {"read_only": True},  # Prevent card_offer from being set manually
            "delivery_completed": {"read_only": True},  # Prevent modification upon creation
        }