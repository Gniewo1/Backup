from django.urls import path
from .views import CardListView, CardOfferCreateView

urlpatterns = [
    path('cards/', CardListView.as_view(), name='card-list'),
    path('card-offers/', CardOfferCreateView.as_view(), name='card-offer-create'),
] 