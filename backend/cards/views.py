from django.shortcuts import render
from rest_framework import generics
from .models import Card
from .serializers import CardSerializer
from rest_framework.permissions import AllowAny

class CardListView(generics.ListAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [AllowAny]