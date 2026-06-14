import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Navigate } from 'react-router-dom';
import { loginWithGoogle } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const mutation = useMutation({
    mutationFn: (credential) => loginWithGoogle(credential),
    onSuccess: (data) => {
      login(data.access, data.refresh, data.user);
      navigate('/');
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full" />
      
      <div className="relative z-10 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-6 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full mx-0 flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight text-center">Welcome Back</h1>
        <p className="text-neutral-400 text-center mb-6 sm:mb-8 text-sm sm:text-base">Sign in to organize and manage your YouTube bookmarks seamlessly.</p>
        
        <div className="w-full flex justify-center hover:scale-[1.02] transition-transform duration-300">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              mutation.mutate(credentialResponse.credential);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="filled_black"
            shape="pill"
            size="large"
          />
        </div>
        
        {mutation.isPending && (
          <p className="mt-6 text-sm text-blue-400 animate-pulse">Authenticating...</p>
        )}
        {mutation.isError && (
          <p className="mt-6 text-sm text-red-400">Failed to authenticate. Please try again.</p>
        )}
      </div>
    </div>
  );
}
