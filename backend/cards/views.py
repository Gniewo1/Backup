from rest_framework import generics
from .models import Card, CardOffer
from .serializers import CardSerializer, CardOfferSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

class CardListView(generics.ListAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [AllowAny]

class CardOfferCreateView(generics.CreateAPIView):
    queryset = CardOffer.objects.all()
    serializer_class = CardOfferSerializer
    permission_classes = [IsAuthenticated]  