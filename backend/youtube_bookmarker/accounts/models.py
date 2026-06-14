from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    google_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True
    )

    profile_picture = models.URLField(
        blank=True,
        null=True
    )