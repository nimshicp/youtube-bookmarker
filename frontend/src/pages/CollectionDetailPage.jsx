import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCollectionDetails, removeVideoFromCollection } from '../api/collections';
import { useDebounce } from '../hooks/useDebounce';

export default function CollectionDetailPage() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['collection', id, debouncedQuery],
    queryFn: () => getCollectionDetails({ id, query: debouncedQuery }),
  });

  const removeVideoMutation = useMutation({
    mutationFn: (videoId) => removeVideoFromCollection(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['collection', id]);
    },
  });

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/shared/${data.collection.share_token}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const collection = data?.collection;
  const videos = data?.videos;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <Link to="/collections" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Collections</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 bg-neutral-900/80 px-4 py-2 rounded-full border border-neutral-800 backdrop-blur-md">
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-neutral-200 hidden sm:block">{user.name}</span>
            </div>
          )}
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-neutral-800/80 hover:bg-neutral-700 text-white text-sm font-medium rounded-full transition-colors cursor-pointer backdrop-blur-md"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {isError || !collection ? (
          <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-2xl border border-red-900/50 w-full">
            <p>Failed to load collection details. It might not exist.</p>
          </div>
        ) : (
          <>
            {/* Collection Header */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                  {collection.name}
                </h1>
                <p className="text-neutral-400">
                  {videos?.length} {videos?.length === 1 ? 'video' : 'videos'}
                  {debouncedQuery && ` matching "${debouncedQuery}"`}
                </p>
              </div>

              {/* Share Button */}
              <button
                onClick={handleCopyShareLink}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 flex-shrink-0 ${
                  copied
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-neutral-800/80 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Link Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Collection
                  </>
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="w-full mb-10 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search videos in this collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-14 pr-5 py-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-neutral-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Videos Grid */}
            <div className="w-full">
              {videos && videos.length === 0 && !debouncedQuery && (
                <div className="flex flex-col items-center justify-center text-neutral-500 py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl backdrop-blur-sm">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg mb-4">No videos in this collection yet.</p>
                  <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors">
                    Find Videos
                  </Link>
                </div>
              )}

              {videos && videos.length === 0 && debouncedQuery && (
                <div className="flex flex-col items-center justify-center text-neutral-500 py-16 bg-neutral-900/20 border border-neutral-800 rounded-3xl backdrop-blur-sm">
                  <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg">No videos matched "<span className="text-white">{debouncedQuery}</span>"</p>
                  <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Clear search</button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos && videos.map((video) => (
                  <div
                    key={video.id}
                    className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-300 backdrop-blur-md flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <button
                        onClick={() => removeVideoMutation.mutate(video.id)}
                        disabled={removeVideoMutation.isPending}
                        className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg disabled:opacity-50"
                        title="Remove from Collection"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-white line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
