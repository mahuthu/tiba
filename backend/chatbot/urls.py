# Chatbot app URLs (chatbot/urls.py)
from django.urls import path
from .views import ChatbotView

app_name = 'chatbot'

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chat'),
    # Optional: endpoint for example questions
    path('examples/', ChatbotView.as_view(), name='examples'),
]