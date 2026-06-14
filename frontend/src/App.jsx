import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BookmarksPage from './pages/BookmarksPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import SharedCollectionPage from './pages/SharedCollectionPage';
import { useAuth } from './context/AuthContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Public route - no auth required */}
        <Route path="/shared/:shareToken" element={<SharedCollectionPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookmarks" 
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/collections" 
          element={
            <ProtectedRoute>
              <CollectionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/collections/:id" 
          element={
            <ProtectedRoute>
              <CollectionDetailPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}