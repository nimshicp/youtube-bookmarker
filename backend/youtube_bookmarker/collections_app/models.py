from django.db import models
import uuid


class Collection(models.Model):

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=255)

    description = models.TextField(
        blank=True
    )

    share_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True
    )

    is_public = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


class CollectionVideo(models.Model):

    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE
    )

    video_id = models.CharField(
        max_length=100
    )

    title = models.CharField(
        max_length=500
    )

    thumbnail = models.URLField()

    added_at = models.DateTimeField(
        auto_now_add=True
    )