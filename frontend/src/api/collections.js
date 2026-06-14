import api from './axios';

export const getCollections = async () => {
  const response = await api.get('/collections/');
  return response.data;
};

export const createCollection = async (data) => {
  const response = await api.post('/collections/create/', data);
  return response.data;
};

export const getCollectionDetails = async ({ id, query }) => {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  const response = await api.get(`/collections/${id}/${params}`);
  return response.data;
};

export const addVideoToCollection = async (data) => {
  const response = await api.post('/collections/add-video/', data);
  return response.data;
};

export const removeVideoFromCollection = async (id) => {
  const response = await api.delete(`/collections/remove-video/${id}/`);
  return response.data;
};

export const getSharedCollection = async ({ shareToken, query }) => {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  const response = await api.get(`/collections/share/${shareToken}/${params}`);
  return response.data;
};
