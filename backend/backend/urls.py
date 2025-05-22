from django.contrib import admin
from django.urls import path, include, re_path  # ✅ добавлен re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import VideoViewSet, register, add_comment
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'', VideoViewSet, basename='video')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/videos/', include(router.urls)),
    path('api/auth/register/', register),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/videos/<int:pk>/comment/', add_comment, name='add_comment'),

    # Главная страница для SPA (vite)
    path('', TemplateView.as_view(template_name='index.html'), name='home'),

    # Для всех остальных путей — также index.html
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
