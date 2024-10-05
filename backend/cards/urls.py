from django.urls import path
from .views import CardListView, CardOfferCreateView, search_offers, offer_details

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('card-offers/', CardOfferCreateView.as_view(), name='card-offer-create'),
    path('search_offers/', search_offers, name='search_offers'),
    path('offers/<int:offer_id>/', offer_details, name='offer_details'),
] 