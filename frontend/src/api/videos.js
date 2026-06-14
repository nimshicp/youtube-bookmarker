import api from './axios';

export const searchVideos = async (query) => {
  const response = await api.get(`/videos/search/?q=${encodeURIComponent(query)}`);
  return response.data;
};
