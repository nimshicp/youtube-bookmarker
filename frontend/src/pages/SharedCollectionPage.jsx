import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getSharedCollection } from '../api/collections';
import { useDebounce } from '../hooks/useDebounce';

export default function SharedCollectionPage() {
  const { shareToken } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shared-collection', shareToken, debouncedQuery],
    queryFn: () => getSharedCollection({ shareToken, query: debouncedQuery }),
    retry: false,
  });

  const collection = data?.collection;
  const videos = data?.videos;

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !collection) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-12 text-center max-w-md w-full backdrop-blur-xl">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
          <p className="text-neutral-400">This shared collection link is invalid or the collection is no longer public.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 relative z-10 flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight">YouTube Bookmarker</span>
        <span className="text-neutral-600 font-light">|</span>
        <span className="text-neutral-400 text-sm">Shared Collection</span>
      </header>

      <main className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* Collection Info Banner */}
        <div className="w-full bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-neutral-800 rounded-2xl p-8 mb-8 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Shared Collection</p>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent mb-2">
              {collection.name}
            </h1>
            <p className="text-neutral-400">
              {videos?.length} {videos?.length === 1 ? 'video' : 'videos'}
              {debouncedQuery && ` matching "${debouncedQuery}"`}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/60 border border-neutral-700 rounded-full text-sm text-neutral-400">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View only</span>
          </div>
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

        <div className="w-full">
          {videos && videos.length === 0 && !debouncedQuery && (
            <div className="flex flex-col items-center justify-center text-neutral-500 py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl backdrop-blur-sm">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">This collection is empty.</p>
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
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-300 backdrop-blur-md hover:shadow-2xl hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl shadow-black/50">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
