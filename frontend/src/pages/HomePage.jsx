import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchVideos } from '../api/videos';
import { createBookmark } from '../api/bookmarks';
import { useDebounce } from '../hooks/useDebounce';
import AddToCollectionModal from '../components/AddToCollectionModal';

export default function HomePage() {
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedVideoForCollection, setSelectedVideoForCollection] = useState(null);

  const { data: videos, isLoading: isSearchLoading, isError } = useQuery({
    queryKey: ['videos', debouncedSearchQuery],
    queryFn: () => searchVideos(debouncedSearchQuery),
    enabled: !!debouncedSearchQuery.trim(),
    staleTime: 5 * 60 * 1000,
  });

  const bookmarkMutation = useMutation({
    mutationFn: (videoData) => createBookmark(videoData),
  });

  const handleBookmark = (video) => {
    bookmarkMutation.mutate({
      video_id: video.video_id,
      title: video.title,
      thumbnail: video.thumbnail,
      channel_name: video.channel,
      published_at: video.published
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <nav className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 sm:mb-12 lg:mb-16 relative z-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">YouTube Bookmarker</span>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <span className="text-white font-medium border-b-2 border-blue-500 pb-1">Search</span>
            <Link to="/bookmarks" className="text-neutral-400 hover:text-white transition-colors font-medium">Bookmarks</Link>
            <Link to="/collections" className="text-neutral-400 hover:text-white transition-colors font-medium">Collections</Link>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-4 w-full md:w-auto">
          {user && (
            <div className="flex items-center gap-3 bg-neutral-900/80 px-4 py-2 rounded-full border border-neutral-800 backdrop-blur-md">
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-neutral-200 hidden sm:block">{user.name}</span>
            </div>
          )}
          <button 
            onClick={logout}
            className="px-4 sm:px-6 py-2.5 bg-neutral-800/80 hover:bg-neutral-700 text-white text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer backdrop-blur-md"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col items-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 sm:mb-8 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent text-center">
            Find and Save Videos
          </h1>
          
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 bg-neutral-900/60 border border-neutral-800 rounded-full text-base sm:text-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-xl transition-all shadow-xl shadow-black/50"
              placeholder="Search YouTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearchLoading && (
              <div className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center pointer-events-none">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          {isError && (
            <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-2xl border border-red-900/50">
              <p>Failed to load search results. Please try again.</p>
            </div>
          )}

          {!isSearchLoading && !isError && videos && videos.length === 0 && (
            <div className="text-center text-neutral-400 p-12">
              <p className="text-xl">No videos found for "{debouncedSearchQuery}".</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {videos && videos.map((video) => (
              <div 
                key={video.video_id} 
                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-300 backdrop-blur-md hover:shadow-2xl hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {/* Add to Collection Button */}
                    <button
                      onClick={() => setSelectedVideoForCollection(video)}
                      className="bg-black/60 hover:bg-green-600 backdrop-blur-md p-2 rounded-full text-white shadow-lg shadow-black/50 transition-colors"
                      title="Add to Collection"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => handleBookmark(video)}
                      className="bg-black/60 hover:bg-blue-600 backdrop-blur-md p-2 rounded-full text-white shadow-lg shadow-black/50 transition-colors"
                      title="Save to Bookmarks"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] sm:text-xs font-medium text-white">
                    {new Date(video.published).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-2 text-sm text-neutral-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span className="truncate">{video.channel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!debouncedSearchQuery && !videos && (
            <div className="flex flex-col items-center justify-center text-neutral-500 py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl backdrop-blur-sm mt-8">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">Enter a search term above to find videos.</p>
            </div>
          )}
        </div>
      </main>

      <AddToCollectionModal 
        isOpen={!!selectedVideoForCollection} 
        onClose={() => setSelectedVideoForCollection(null)} 
        video={selectedVideoForCollection} 
      />
    </div>
  );
}
