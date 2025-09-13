from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.csrf_token, name='csrf_token'),
    path('status/', views.auth_status, name='auth_status'),
    path('get-sso-user/', views.get_sso_user_data, name='get_sso_user'),
    path('logout/', views.logout_view, name='logout'),
]