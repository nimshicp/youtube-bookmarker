from rest_framework.views import APIView
from rest_framework.response import Response

from .youtube_service import search_youtube


class VideoSearchView(APIView):

    def get(self, request):

        query = request.GET.get("q")

        if not query:
            return Response([])

        data = search_youtube(query)

        videos = []

        for item in data.get("items", []):

            videos.append({
                "video_id":
                    item["id"]["videoId"],

                "title":
                    item["snippet"]["title"],

                "thumbnail":
                    item["snippet"]["thumbnails"]["high"]["url"],

                "channel":
                    item["snippet"]["channelTitle"],

                "published":
                    item["snippet"]["publishedAt"]
            })

        return Response(videos)