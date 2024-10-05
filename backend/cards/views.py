from rest_framework import generics
from .models import Card, CardOffer
from .serializers import CardSerializer, CardOfferSerializer, CardPurchaseSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse, Http404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

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
    data = list(results.values('id', 'user__username', 'card__name','card__image', 'offer_price', 'created_at', 'is_active'))

    return JsonResponse({'results': data})

def offer_details(request, offer_id):
    try:
        offer = CardOffer.objects.get(id=offer_id, is_active=True)  # Get the offer by ID, and ensure it's active
    except CardOffer.DoesNotExist:
        raise Http404("Offer not found")

    # Prepare the offer data for response
    data = {
        'id': offer.id,
        'user': offer.user.username,
        'card_name': offer.card.name,
        'card_image': offer.card.image.url,  # Assuming 'image' is a File/ImageField
        'offer_price': offer.offer_price,
        'created_at': offer.created_at,
        'is_active': offer.is_active,
    }

    return JsonResponse(data)

@api_view(['POST'])
def create_card_purchase(request):
    serializer = CardPurchaseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)