from django.urls import path

from .views import (
    BookmarkCreateView,
    BookmarkListView,
    BookmarkDeleteView
)

urlpatterns = [

    path(
        "",
        BookmarkListView.as_view()
    ),

    path(
        "create/",
        BookmarkCreateView.as_view()
    ),

    path(
        "<int:pk>/",
        BookmarkDeleteView.as_view()
    ),
]