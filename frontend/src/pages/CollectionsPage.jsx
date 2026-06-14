import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCollections, createCollection } from '../api/collections';

export default function CollectionsPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [newCollectionName, setNewCollectionName] = useState('');

  const { data: collections, isLoading, isError } = useQuery({
    queryKey: ['collections'],
    queryFn: getCollections,
  });

  const createMutation = useMutation({
    mutationFn: (name) => createCollection({ name, description: '' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['collections']);
      setNewCollectionName('');
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
      {/* Background decorations */}
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
            <Link to="/bookmarks" className="text-neutral-400 hover:text-white transition-colors font-medium">Bookmarks</Link>
            <span className="text-white font-medium border-b-2 border-blue-500 pb-1">Collections</span>
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
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            My Collections
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="text"
              placeholder="New Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="flex-grow bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 backdrop-blur-md shadow-lg min-w-0"
            />
            <button
              onClick={() => createMutation.mutate(newCollectionName)}
              disabled={!newCollectionName.trim() || createMutation.isPending}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              Create
            </button>
          </div>
        </div>

        <div className="w-full">
          {isError && (
            <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-2xl border border-red-900/50">
              <p>Failed to load collections. Please try again.</p>
            </div>
          )}

          {!isLoading && !isError && collections && collections.length === 0 && (
            <div className="flex flex-col items-center justify-center text-neutral-500 py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl backdrop-blur-sm">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg">You haven't created any collections yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {collections && collections.map((collection) => (
              <Link
                to={`/collections/${collection.id}`}
                key={collection.id} 
                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 sm:p-6 hover:bg-neutral-800/60 hover:border-neutral-700 transition-all duration-300 backdrop-blur-md hover:shadow-2xl hover:-translate-y-1 flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg sm:text-xl text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {collection.name}
                </h3>
                <p className="text-sm text-neutral-400 mt-auto pt-4">
                  Created {new Date(collection.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
