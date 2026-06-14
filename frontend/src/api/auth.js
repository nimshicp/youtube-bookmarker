import api from './axios';

export const loginWithGoogle = async (credential) => {
  const response = await api.post('/auth/google/', { credential });
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};
