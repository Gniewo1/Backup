from django.urls import path
from .views import CardListView, CardOfferCreateView, search_offers, offer_details, offer_sold, update_card_offer_status, card_names, card_image, place_offer, search_useroffers, NewestOffersView, ExpiredOrInactiveOffersView

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('create-offers/', CardOfferCreateView.as_view(), name='create-offer'),
    path('search_offers/', search_offers, name='search_offers'),
    path('offers/<int:offer_id>/', offer_details, name='offer_details'),
    path('update-card-status/<int:pk>/', update_card_offer_status, name='update_card_offer_status'),
    path('card-names/', card_names, name='card_names'),
    path('card-image/<int:card_id>/', card_image, name='card_image'),
    path('place-offer/<int:offer_id>/', place_offer, name='place_offer'),
    path('search-useroffers/', search_useroffers, name='search_useroffers'),
    path('newest-offers/', NewestOffersView.as_view(), name='newest-offers'),
    path('expired-offers/', ExpiredOrInactiveOffersView.as_view(), name='expired-offers'),
    path('offer-sold/<int:offer_id>/', offer_sold, name='offer_sold'),
] 