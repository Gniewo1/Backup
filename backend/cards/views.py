from rest_framework import generics
from .models import Card, CardOffer, UserOffer, ShippingData
# from users.models import CustomUser
from .serializers import CardSerializer, CardOfferSerializer, CardOfferSerializer, CardWinOfferSerializer, ShippingDataSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.utils.timezone import now
from decimal import Decimal
from django.db.models import Max




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


### Search offers made by certain user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_useroffers(request):
    user = request.user
    offers = CardOffer.objects.filter(seller=user)  # Filter offers by the logged-in user
    data = list(offers.values(
        'id', 'front_image', 'auction_current_price', 'buy_now_price', 'card__name', 'auction_end_date', 'is_active'
    ))
    return JsonResponse({'offers': data})


### Search offers with given card name
def search_offers(request):
    query = request.GET.get('q', '')  # 'q' is the query parameter from the URL
    time = now()
    if query:
        # Filter CardOffer by related Card's name (case-insensitive search)
        results = CardOffer.objects.filter(card__name__icontains=query, is_active=True, auction_end_date__gte= time)

    else:
        results = CardOffer.objects.none()

    # Convert queryset to a list of dictionaries
    data = list(results.values('id', 'front_image', 'auction_current_price', 'buy_now_price', 'card__name', 'seller__username', 'auction_end_date'))

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
        'card_image_back': offer.back_image.url if offer.back_image else None,
        'auction_price': offer.auction_current_price,
        'buy_now_price': offer.buy_now_price,
        'created_at': offer.created_at,
        'auction_end_date': offer.auction_end_date,
        'is_active': offer.is_active,
    }

    return JsonResponse(data)



@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def place_offer(request, offer_id):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            print(data)
            offer_price = data.get("offer_price")
            offer_price = Decimal(offer_price)
            offer_type = data.get("offer_type")
            

            # Get the authenticated user (buyer)
            buyer = request.user

            # Get the CardOffer object
            card_offer = CardOffer.objects.get(id=offer_id)

            # Check if auction is active
            if card_offer.auction_end_date and now() > card_offer.auction_end_date:
                return JsonResponse({"error": "Auction has already ended."}, status=400)
            
            if offer_type == 'auction':

                # Check if the new offer is greater than the current price
                if offer_price <= card_offer.auction_current_price:
                    return JsonResponse({"error": "Offer price must be greater than the current auction price."}, status=400)
                
                if offer_price >= card_offer.buy_now_price and card_offer.buy_now_price != 0:
                    return JsonResponse({"error": "Offer price must be smaller than buy_now price."}, status=400)

                # Update the current auction price
                card_offer.auction_current_price = offer_price
                card_offer.save()

                # Create a new UserOffer
                UserOffer.objects.create(
                    card_offer=card_offer,
                    buyer=buyer,
                    offer_price=offer_price,
                )

            if offer_type == 'buy_now':
                card_offer.auction_current_price = offer_price
                card_offer.is_active = False
                card_offer.save()

                UserOffer.objects.create(
                    card_offer=card_offer,
                    buyer=buyer,
                    offer_price=offer_price,
                    is_winner = True,
                )



            return JsonResponse({"message": "Offer placed successfully."}, status=200)

        except CardOffer.DoesNotExist:
            return JsonResponse({"error": "Card offer not found."}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)   


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

### Is taking 10 newsest offers
class NewestOffersView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        time = now()
        newest_offers = CardOffer.objects.filter(is_active=True, auction_end_date__gte= time).order_by('-created_at')[:10]
        response_data = list(newest_offers.values(
            'id',
            'card__name',  # Access related field via double underscore
            'seller__username',  # Access related field
            'offer_type',
            'buy_now_price',
            'auction_current_price',
            'auction_end_date',
            'front_image',
        ))
        return JsonResponse(response_data, safe=False)
    
# # class WinOffers
# def win_offers(user):
#     # Subquery to get the highest offer for each expired or inactive CardOffer
#     highest_offers = UserOffer.objects.filter(
#         card_offer=OuterRef('pk')
#     ).order_by('-offer_price').values('offer_price')[:1]

#     # Get all expired or inactive offers where the user has the highest bid
#     user_winning_offers = UserOffer.objects.filter(
#         buyer=user,
#         card_offer__is_active=False
#     ).annotate(
#         max_price=Subquery(highest_offers)
#     ).filter(offer_price=F('max_price'))

#     return user_winning_offers

class ExpiredOrInactiveOffersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request.user)
        user = request.user  # Pobranie aktualnie zalogowanego użytkownika

        # Pobranie ofert, które są nieaktywne lub ich czas się skończył
        expired_or_inactive_offers = CardOffer.objects.filter(
            is_active=False
        ) | CardOffer.objects.filter(
            auction_end_date__lt=now()
        )
        print("test")

        # Pobranie ofert, gdzie ostatnia oferta została złożona przez użytkownika
        user_last_offers = UserOffer.objects.filter(
            buyer=user
        ).values('card_offer').annotate(last_offer_time=Max('created_at'))

        # Pobranie ID ofert, które spełniają ostatni warunek
        user_offer_ids = [offer['card_offer'] for offer in user_last_offers]

        # Filtrowanie, by spełnić wszystkie warunki
        filtered_offers = expired_or_inactive_offers.filter(id__in=user_offer_ids)

        # Serializacja wyników
        serializer = CardWinOfferSerializer(filtered_offers, many=True)
        return Response(serializer.data)
    
def offer_sold(request, offer_id):
    try:
        offer = CardOffer.objects.get(id=offer_id)  # Get the offer by ID, and ensure it's active
    except CardOffer.DoesNotExist:
        raise Http404("Offer not found")

    # Prepare the offer data for response
    data = {
        'id': offer.id,
        'user': offer.seller.username,
        'card_name': offer.card.name,
        'card_image': offer.front_image.url if offer.front_image else None,  # Assuming 'image' is a File/ImageField
        'card_image_back': offer.back_image.url if offer.back_image else None,
        'auction_price': offer.auction_current_price,
        'buy_now_price': offer.buy_now_price,
        'created_at': offer.created_at,
        'auction_end_date': offer.auction_end_date,
        'is_active': offer.is_active,
        'bank_number':offer.bank_account_number,
    }

    return JsonResponse(data)


class DeliveryDataView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can post

    def post(self, request, offer_id):
        try:
            offer = CardOffer.objects.get(id=offer_id)
            if ShippingData.objects.filter(card_offer=offer).exists():
                return Response({"error": "Offer already have delivery adress"}, status=status.HTTP_404_NOT_FOUND)
        except CardOffer.DoesNotExist:
            return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ShippingDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(card_offer=offer)  # Associate shipping data with the offer
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Received Data:", request.data)  # Debugging
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)