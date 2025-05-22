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
    dislikes_count = serializers.SerializerMethodField()

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
            'dislikes_count',
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_dislikes_count(self, obj):
        return obj.dislikes.count()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")
        if request and instance.video_file:
            rep["video_file"] = request.build_absolute_uri(instance.video_file.url)
        if request and instance.thumbnail:
            rep["thumbnail"] = request.build_absolute_uri(instance.thumbnail.url)
        return rep

