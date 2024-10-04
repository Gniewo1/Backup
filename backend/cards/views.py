from rest_framework import generics
from .models import Card, CardOffer
from .serializers import CardSerializer, CardOfferSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse

class CardListView(generics.ListAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [AllowAny]

class CardOfferCreateView(generics.CreateAPIView):
    queryset = CardOffer.objects.all()
    serializer_class = CardOfferSerializer
    permission_classes = [IsAuthenticated]  



def search_offers(request):
    query = request.GET.get('q', '')  # 'q' is the query parameter from the URL
    if query:
        # Filter CardOffer by related Card's name (case-insensitive search)
        results = CardOffer.objects.filter(card__name__icontains=query, is_active=True)
    else:
        results = CardOffer.objects.none()

    # Convert queryset to a list of dictionaries
    data = list(results.values('user__username', 'card__name','card__image', 'offer_price', 'created_at', 'is_active'))

    return JsonResponse({'results': data})