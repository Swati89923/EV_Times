import api from "./api";

export const aiChat = (message) => api.get(`/api/ai/chat`, { params: { message } });

export const summarizeArticle = (article) => api.post(`/api/ai/summary`, { article });
