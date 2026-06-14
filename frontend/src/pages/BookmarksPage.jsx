import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookmarks, deleteBookmark } from '../api/bookmarks';
import AddToCollectionModal from '../components/AddToCollectionModal';

export default function BookmarksPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedVideoForCollection, setSelectedVideoForCollection] = useState(null);

  const { data: bookmarks, isLoading, isError } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks']);
    },
  });

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
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

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
            <Link to="/" className="text-neutral-400 hover:text-white transition-colors font-medium">Search</Link>
            <span className="text-white font-medium border-b-2 border-blue-500 pb-1">Bookmarks</span>
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
        <div className="w-full flex flex-col items-start mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            My Saved Videos
          </h1>
          <p className="text-neutral-400">
            {bookmarks ? `${bookmarks.length} videos bookmarked` : 'Loading...'}
          </p>
        </div>

        <div className="w-full">
          {isError && (
            <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-2xl border border-red-900/50">
              <p>Failed to load bookmarks. Please try again.</p>
            </div>
          )}

          {!isLoading && !isError && bookmarks && bookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center text-neutral-500 py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl backdrop-blur-sm">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-lg mb-4">You haven't saved any videos yet.</p>
              <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors">
                Find Videos
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {bookmarks && bookmarks.map((bookmark) => (
              <div 
                key={bookmark.id} 
                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-300 backdrop-blur-md flex flex-col"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <img 
                    src={bookmark.thumbnail} 
                    alt={bookmark.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                     {/* Add to Collection Button */}
                    <button
                      onClick={() => setSelectedVideoForCollection({
                        video_id: bookmark.video_id,
                        title: bookmark.title,
                        thumbnail: bookmark.thumbnail,
                      })}
                      className="bg-black/60 hover:bg-green-600 backdrop-blur-md p-2 rounded-full text-white shadow-lg shadow-black/50 transition-colors"
                      title="Add to Collection"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </button>

                    {/* Delete Bookmark Button */}
                    <button
                      onClick={() => deleteMutation.mutate(bookmark.id)}
                      disabled={deleteMutation.isPending}
                      className="bg-red-500/80 hover:bg-red-600 backdrop-blur-md p-2 rounded-full text-white shadow-lg shadow-black/50 transition-all disabled:opacity-50"
                      title="Remove Bookmark"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] sm:text-xs font-medium text-white">
                    {new Date(bookmark.published_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 leading-snug">
                    {bookmark.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      <span className="truncate max-w-[120px]">{bookmark.channel_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
