from django.urls import path, include
from knox import views as knox_views
from rest_framework.routers import DefaultRouter
from .views import RegisterAPI, UserCheckView, LoginAPI, get_items, get_user_info, VerificationRequestView, ShowVerificationRequests, VerifyingUser, VerificationRequestUpdate

router = DefaultRouter()
router.register(r'verification-requests', VerificationRequestUpdate, basename='verification-request')

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('auth/user/', UserCheckView.as_view(), name='user-check'),
    # path('api/current_user/', current_user, name='current_user'),
    path('items/', get_items, name='get_items'),
    path('user-info/', get_user_info, name='get_user_info'),
    path('verification-request/', VerificationRequestView.as_view(), name='verification-request'),
    path('show-verification-requests/', ShowVerificationRequests.as_view(), name='show-verification-requests'),
    path('verifying-user/', VerifyingUser, name='verifying-user'),
    path('', include(router.urls)),
]
