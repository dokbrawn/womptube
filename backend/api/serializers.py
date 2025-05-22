from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Video, Comment, Like

# Сначала определяем UserSerializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

# Потом CommentSerializer
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']

# Затем VideoSerializer
class VideoSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    views = serializers.IntegerField(read_only=True)

    class Meta:
        model = Video
        fields = [
            'id',
            'author',
            'title',
            'description',
            'video_file',
            'thumbnail',
            'created_at',
            'likes_count',
            'views',
            'comments',
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()
