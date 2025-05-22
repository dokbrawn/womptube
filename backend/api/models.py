import os
import uuid
import subprocess
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from moviepy.editor import VideoFileClip


class Video(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # 📼 Перекодировка в .mp4 с faststart (если формат не .mp4)
        if self.video_file:
            original_path = self.video_file.path
            base, ext = os.path.splitext(original_path)

            if ext.lower() != '.mp4':
                mp4_path = f"{base}_converted.mp4"
                try:
                    subprocess.run([
                        'ffmpeg', '-i', original_path,
                        '-c:v', 'libx264', '-c:a', 'aac',
                        '-strict', 'experimental',
                        '-movflags', '+faststart',
                        mp4_path
                    ], check=True)

                    os.remove(original_path)
                    os.rename(mp4_path, original_path)
                except Exception as e:
                    print(f"❌ Ошибка перекодировки: {e}")

        # 🖼 Генерация превью (если нет)
        if self.video_file and not self.thumbnail:
            try:
                clip = VideoFileClip(self.video_file.path)
                frame_filename = f"{uuid.uuid4()}.jpg"
                frame_path = os.path.join(settings.MEDIA_ROOT, "thumbnails", frame_filename)
                os.makedirs(os.path.dirname(frame_path), exist_ok=True)

                clip.save_frame(frame_path, t=1.0)
                self.thumbnail.name = f"thumbnails/{frame_filename}"
                super().save(update_fields=["thumbnail"])
            except Exception as e:
                print(f"❌ Ошибка генерации превью: {e}")


class Comment(models.Model):
    video = models.ForeignKey(Video, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Комментарий от {self.author.username} к видео "{self.video.title}"'


class Like(models.Model):
    video = models.ForeignKey(Video, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('video', 'user')

    def __str__(self):
        return f'{self.user.username} лайкнул "{self.video.title}"'
    
class Dislike(models.Model):
    video = models.ForeignKey(Video, related_name='dislikes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('video', 'user')

    def __str__(self):
        return f'{self.user.username} дизлайкнул "{self.video.title}"'

