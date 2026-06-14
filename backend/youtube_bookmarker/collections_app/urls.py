from django.urls import path

from .views import (
    CollectionCreateView,
    CollectionListView,
    CollectionDetailView,
    AddVideoToCollectionView,
    RemoveVideoFromCollectionView,
    SharedCollectionView
)

urlpatterns = [

    path(
        "",
        CollectionListView.as_view()
    ),

    path(
        "create/",
        CollectionCreateView.as_view()
    ),

    path(
        "<int:pk>/",
        CollectionDetailView.as_view()
    ),

    path(
        "add-video/",
        AddVideoToCollectionView.as_view()
    ),

    path(
        "remove-video/<int:pk>/",
        RemoveVideoFromCollectionView.as_view()
    ),
    path(
    "share/<uuid:share_token>/",
    SharedCollectionView.as_view(),
    name="shared-collection"
),
]