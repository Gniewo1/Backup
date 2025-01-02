from django.urls import path
from .views import CardListView, CardOfferCreateView, search_offers, offer_details, update_card_offer_status

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('create-offers/', CardOfferCreateView.as_view(), name='create-offer'),
    path('search_offers/', search_offers, name='search_offers'),
    path('offers/<int:offer_id>/', offer_details, name='offer_details'),
    # path('purchases/', create_card_purchase, name='create_card_purchase'),
    path('update-card-status/<int:pk>/', update_card_offer_status, name='update_card_offer_status'),
] 