from django.test import TestCase
from rest_framework.test import APITestCase
from .models import Card, CardOffer
from django.contrib.auth import get_user_model
from django.urls import reverse
from .serializers import CardOfferSerializer
# Create your tests here.

User = get_user_model()


class CardOfferModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.card = Card.objects.create(name="Magic Card")
        self.offer = CardOffer.objects.create(
            card=self.card, seller=self.user, auction_start_price=10.0, is_active=True
        )

    def test_offer_creation(self):
        self.assertEqual(self.offer.auction_start_price, 10.0)
        self.assertTrue(self.offer.is_active)



class CardOfferAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse("newest-offers")

    def test_get_offers(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)



class CardOfferSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.card = Card.objects.create(name="Magic Card")
        self.offer = CardOffer.objects.create(card=self.card, seller=self.user, auction_start_price=10.0)

    def test_serializer_output(self):
        serializer = CardOfferSerializer(self.offer)
        data = serializer.data
        self.assertEqual(data["auction_start_price"], "10.00")