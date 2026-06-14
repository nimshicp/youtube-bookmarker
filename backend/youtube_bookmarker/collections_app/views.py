from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from .models import Collection, CollectionVideo
from .serializers import (
    CollectionSerializer,
    CollectionVideoSerializer
)


class CollectionCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CollectionSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            user=request.user
        )

        return Response(
            serializer.data,
            status=201
        )


class CollectionListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        collections = Collection.objects.filter(
            user=request.user
        )

        serializer = CollectionSerializer(
            collections,
            many=True
        )

        return Response(
            serializer.data
        )


class CollectionDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        collection = Collection.objects.get(
            id=pk,
            user=request.user
        )

        collection_data = CollectionSerializer(
            collection
        ).data

        query = request.GET.get("q")

        videos = CollectionVideo.objects.filter(
            collection=collection
        )

        if query:
            videos = videos.filter(
                title__icontains=query
            )

        videos_data = CollectionVideoSerializer(
            videos,
            many=True
        ).data

        return Response({
            "collection": collection_data,
            "videos": videos_data
        })


class AddVideoToCollectionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CollectionVideoSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        collection = Collection.objects.get(
            id=request.data.get("collection"),
            user=request.user
        )

        serializer.save(
            collection=collection
        )

        return Response(
            serializer.data,
            status=201
        )


class RemoveVideoFromCollectionView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        video = CollectionVideo.objects.get(
            id=pk
        )

        if video.collection.user != request.user:

            return Response(
                {
                    "detail":
                    "Not authorized"
                },
                status=403
            )

        video.delete()

        return Response(
            {
                "message":
                "Video removed successfully"
            },
            status=204
        )




class SharedCollectionView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, share_token):

        collection = Collection.objects.get(
            share_token=share_token,
            is_public=True
        )

        query = request.GET.get("q")

        videos = CollectionVideo.objects.filter(
            collection=collection
        )

        if query:
            videos = videos.filter(
                title__icontains=query
            )

        collection_data = CollectionSerializer(
            collection
        ).data

        videos_data = CollectionVideoSerializer(
            videos,
            many=True
        ).data

        return Response({
            "collection": collection_data,
            "videos": videos_data
        })