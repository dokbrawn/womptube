from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, register
from . import views

router = DefaultRouter()
router.register('videos', VideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register),
    path('videos/<int:pk>/comments/', views.add_comment),
]
