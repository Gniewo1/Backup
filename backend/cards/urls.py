from django.urls import path
from .views import CardListView, CardOfferCreateView, search_offers, offer_details, create_card_purchase, update_card_offer_status

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('card-offers/', CardOfferCreateView.as_view(), name='card-offer-create'),
    path('search_offers/', search_offers, name='search_offers'),
    path('offers/<int:offer_id>/', offer_details, name='offer_details'),
    path('purchases/', create_card_purchase, name='create_card_purchase'),
    path('update-card-status/<int:pk>/', update_card_offer_status, name='update_card_offer_status'),
] 