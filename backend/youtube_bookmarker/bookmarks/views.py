from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BookmarkSerializer(
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


class BookmarkListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookmarks = Bookmark.objects.filter(
            user=request.user
        )

        serializer = BookmarkSerializer(
            bookmarks,
            many=True
        )

        return Response(
            serializer.data
        )


class BookmarkDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        bookmark = Bookmark.objects.get(
            pk=pk,
            user=request.user
        )

        bookmark.delete()

        return Response(
            status=204
        )