from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.get_quiz_status, name='quiz_status'),
    path('start/', views.start_quiz, name='start_quiz'),
    path('question/', views.get_current_question, name='current_question'),
    path('submit/', views.submit_answer, name='submit_answer'),
    path('collected-rolls/', views.get_collected_rolls, name='collected_rolls'),
]