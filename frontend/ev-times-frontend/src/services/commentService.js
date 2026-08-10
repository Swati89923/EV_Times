import api from "./api";

export const getComments = (newsId) => api.get(`/comments/${newsId}`);

export const postComment = (newsId, payload) => api.post(`/comments/${newsId}`, payload);

export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);
