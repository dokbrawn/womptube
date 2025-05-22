from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

from .models import Video, Comment, Like
from .serializers import VideoSerializer, CommentSerializer, UserSerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-created_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("Вы не можете удалить это видео")
        instance.delete()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        like, created = Like.objects.get_or_create(video=video, user=request.user)
        if not created:
            return Response({'detail': 'Already liked'}, status=400)
        return Response({'detail': 'Liked'})

    @action(detail=True, methods=['post'])
    def views(self, request, pk=None):
        video = self.get_object()
        video.views += 1
        video.save(update_fields=["views"])
        return Response({'views': video.views})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], parser_classes=[JSONParser])
    def comment(self, request, pk=None):
        video = self.get_object()
        content = request.data.get("content", "")
        if not content:
            return Response({"error": "Комментарий не может быть пустым"}, status=400)
        comment = Comment.objects.create(video=video, author=request.user, content=content)
        return Response(CommentSerializer(comment).data, status=201)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, pk):
    video = get_object_or_404(Video, pk=pk)
    content = request.data.get('content')
    if not content:
        return Response({'error': 'Комментарий пустой'}, status=400)
    comment = Comment.objects.create(video=video, author=request.user, content=content)
    return Response({
        'id': comment.id,
        'content': comment.content,
        'author': request.user.username
    })
