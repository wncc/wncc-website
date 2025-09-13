from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'roll_number', 'year', 'branch', 'degree', 'created_at']
    search_fields = ['user__username', 'roll_number', 'user__email', 'year', 'branch', 'degree']
    list_filter = ['created_at', 'year', 'branch', 'degree']