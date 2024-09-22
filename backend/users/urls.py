from django.urls import path
from knox import views as knox_views
from .views import RegisterAPI, UserCheckView, LoginAPI, get_items, get_user_info, VerificationRequestView, ShowVerificationRequests, VerifyingUser

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
]