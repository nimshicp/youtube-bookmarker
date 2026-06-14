import requests
from django.conf import settings


def search_youtube(query):

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 20,
        "key": settings.YOUTUBE_API_KEY
    }

    response = requests.get(
        url,
        params=params
    )

    return response.json()