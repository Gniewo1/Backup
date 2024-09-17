from django.contrib import admin

# Register your models here.

from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


# class CustomUserAdmin(UserAdmin):
#     # Add the 'verified' field to the list display in admin
#     list_display = ['username', 'email', 'verified', 'is_staff']

admin.site.register(CustomUser)
