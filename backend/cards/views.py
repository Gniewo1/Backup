from rest_framework import generics
from .models import Card, CardOffer
from .serializers import CardSerializer, CardOfferSerializer, CardOfferSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse, Http404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class CardListView(generics.ListAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [AllowAny]

class CardOfferCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CardOfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seller=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#fetch all card names 
def card_names(request):
    cards = Card.objects.all().values('id', 'name')  # Queryset with only `id` and `name`
    card_list = list(cards)  # Convert queryset to list
    return JsonResponse(card_list, safe=False)

#fetch current card image
def card_image(request, card_id):
    card = Card.objects.filter(id=card_id).first()
    if card:
        card_data = {
            "id": card.id,
            "name": card.name,
            "image": request.build_absolute_uri(card.image.url)
        }
        return JsonResponse(card_data)
    return JsonResponse({'error': 'Card not found'}, status=404)



def search_offers(request):
    query = request.GET.get('q', '')  # 'q' is the query parameter from the URL
    if query:
        # Filter CardOffer by related Card's name (case-insensitive search)
        results = CardOffer.objects.filter(card__name__icontains=query, is_active=True)
    else:
        results = CardOffer.objects.none()

    # Convert queryset to a list of dictionaries
    data = list(results.values('id', 'front_image', 'auction_start_price', 'buy_now_price', 'card__name', 'seller__username'))

    return JsonResponse({'results': data})

def offer_details(request, offer_id):
    try:
        offer = CardOffer.objects.get(id=offer_id, is_active=True)  # Get the offer by ID, and ensure it's active
    except CardOffer.DoesNotExist:
        raise Http404("Offer not found")

    # Prepare the offer data for response
    data = {
        'id': offer.id,
        'user': offer.seller.username,
        'card_name': offer.card.name,
        'card_image': offer.front_image.url if offer.front_image else None,  # Assuming 'image' is a File/ImageField
        'auction_price': offer.auction_start_price,
        'buy_now_price': offer.buy_now_price,
        'created_at': offer.created_at,
        'is_active': offer.is_active,
    }

    return JsonResponse(data)

# @api_view(['POST'])
# def create_card_purchase(request):
#     serializer = CardPurchaseSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def update_card_offer_status(request, pk):
    try:
        card_offer = CardOffer.objects.get(pk=pk)
    except CardOffer.DoesNotExist:
        return Response({'error': 'Card offer not found'}, status=status.HTTP_404_NOT_FOUND)

    # Update the `is_active` field based on the request data
    card_offer.is_active = request.data.get('is_active', card_offer.is_active)
    card_offer.save()
    
    # Serialize and return the updated card offer
    serializer = CardOfferSerializer(card_offer)
    return Response(serializer.data, status=status.HTTP_200_OK)