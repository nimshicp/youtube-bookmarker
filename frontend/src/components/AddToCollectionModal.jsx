import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCollections, createCollection, addVideoToCollection } from '../api/collections';

export default function AddToCollectionModal({ isOpen, onClose, video }) {
  const [newCollectionName, setNewCollectionName] = useState('');
  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: getCollections,
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: (name) => createCollection({ name, description: '' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['collections']);
      setNewCollectionName('');
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: (collectionId) => addVideoToCollection({
      collection: collectionId,
      video_id: video.video_id,
      title: video.title,
      thumbnail: video.thumbnail,
    }),
    onSuccess: () => {
      onClose();
    },
  });

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add to Collection</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : collections && collections.length > 0 ? (
            <ul className="space-y-2 mb-6">
              {collections.map(col => (
                <li key={col.id}>
                  <button
                    onClick={() => addVideoMutation.mutate(col.id)}
                    disabled={addVideoMutation.isPending}
                    className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-xl text-white font-medium transition-colors flex justify-between items-center group"
                  >
                    {col.name}
                    <svg className="w-5 h-5 text-neutral-500 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 text-center mb-6">No collections yet.</p>
          )}

          <div className="border-t border-neutral-800 pt-6">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Create New Collection</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                className="flex-grow bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => createMutation.mutate(newCollectionName)}
                disabled={!newCollectionName.trim() || createMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
