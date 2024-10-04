from django.urls import path
from .views import CardListView, CardOfferCreateView, search_offers

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('card-offers/', CardOfferCreateView.as_view(), name='card-offer-create'),
    path('search_offers/', search_offers, name='search_offers'),
] 