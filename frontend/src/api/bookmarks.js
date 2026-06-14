import api from './axios';

export const getBookmarks = async () => {
  const response = await api.get('/bookmarks/');
  return response.data;
};

export const createBookmark = async (bookmarkData) => {
  const response = await api.post('/bookmarks/create/', bookmarkData);
  return response.data;
};

export const deleteBookmark = async (id) => {
  const response = await api.delete(`/bookmarks/${id}/`);
  return response.data;
};
