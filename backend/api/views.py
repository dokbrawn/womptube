from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

from .models import Video, Comment, Like, Dislike
from .serializers import VideoSerializer, CommentSerializer, UserSerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-created_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        print("📂 FILES:", request.FILES)
        print("📝 DATA:", request.data)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("Вы не можете удалить это видео")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        video = self.get_object()
        user = request.user

        # Удалить дизлайк, если есть
        Dislike.objects.filter(video=video, user=user).delete()

        # Переключение лайка
        existing_like = Like.objects.filter(video=video, user=user)
        if existing_like.exists():
            existing_like.delete()
            return Response({'detail': 'Лайк убран'}, status=200)

        Like.objects.create(video=video, user=user)
        return Response({'detail': 'Лайк поставлен'}, status=200)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def dislike(self, request, pk=None):
        video = self.get_object()
        user = request.user

        # Удалить лайк, если есть
        Like.objects.filter(video=video, user=user).delete()

        # Переключение дизлайка
        existing_dislike = Dislike.objects.filter(video=video, user=user)
        if existing_dislike.exists():
            existing_dislike.delete()
            return Response({'detail': 'Дизлайк убран'}, status=200)

        Dislike.objects.create(video=video, user=user)
        return Response({'detail': 'Дизлайк поставлен'}, status=200)

    @action(detail=True, methods=['post'])
    def views(self, request, pk=None):
        video = self.get_object()
        video.views += 1
        video.save(update_fields=["views"])
        return Response({'views': video.views})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], parser_classes=[JSONParser])
    def comment(self, request, pk=None):
        video = self.get_object()
        content = request.data.get("content", "").strip()

        if not content:
            return Response({"error": "Комментарий не может быть пустым"}, status=400)

        comment = Comment.objects.create(video=video, author=request.user, content=content)
        return Response(CommentSerializer(comment).data, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Имя пользователя и пароль обязательны'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Имя пользователя уже занято'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, pk):
    video = get_object_or_404(Video, pk=pk)
    content = request.data.get('content', '').strip()

    if not content:
        return Response({'error': 'Комментарий пустой'}, status=400)

    comment = Comment.objects.create(video=video, author=request.user, content=content)
    return Response({
        'id': comment.id,
        'content': comment.content,
        'author': request.user.username
    })
