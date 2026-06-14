from rest_framework import serializers
from .models import Collection, CollectionVideo


class CollectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Collection
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "share_token",
            "created_at"
        )


class CollectionVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CollectionVideo
        fields = "__all__"
        read_only_fields = (
            "id",
            "added_at"
        )