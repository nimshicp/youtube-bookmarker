import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">YouTube Bookmarker</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-neutral-200">{user.name}</span>
            </div>
          )}
          <button 
            onClick={logout}
            className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto text-center py-20">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Your Bookmarks, Organized.
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Start saving and managing your favorite YouTube timestamps easily.
        </p>
      </main>
    </div>
  );
}
