from django.db import models


class Bookmark(models.Model):

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE
    )

    video_id = models.CharField(max_length=100)

    title = models.CharField(max_length=500)

    thumbnail = models.URLField()

    channel_name = models.CharField(max_length=255)

    published_at = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title