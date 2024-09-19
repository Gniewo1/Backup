from django.urls import path
from knox import views as knox_views
from .views import RegisterAPI, UserCheckView, LoginAPI, get_items, get_user_info

urlpatterns = [
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('api/auth/user/', UserCheckView.as_view(), name='user-check'),
    # path('api/current_user/', current_user, name='current_user'),
    path('api/items/', get_items, name='get_items'),
    path('api/user-info/', get_user_info, name='get_user_info'),
]