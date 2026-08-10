import api from "./api";

export const getAllNews = (page = 0, size = 12, sortBy = "id", direction = "desc") => {
  return api.get(`/news?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
};

export const getNewsById = (id) => {
  return api.get(`/news/${id}`);
};

export const getNewsByState = (
  state,
  page = 0,
  size = 15
) => {
  return api.get(
    `/news/state/${state}?page=${page}&size=${size}`
  );
};
export const searchNews = (keyword) => {
  return api.get(`/news/search?keyword=${encodeURIComponent(keyword)}`);
};

export const getNewsByCategory = (category) => {
  return api.get(`/news/category/${encodeURIComponent(category)}`);
};

export const filterNews = (category, keyword) => {
  return api.get(
    `/news/filter?category=${encodeURIComponent(category)}&keyword=${encodeURIComponent(keyword)}`
  );
};

export const getActiveBreakingNews = () => {
  return api.get("/breaking-news/active");
};

export const getPopularNews = () => {
  return api.get("/news/popular");
};

export const getPendingNews = () => {
  return api.get("/admin/news/pending");
};

export const approveNews = (id) => {
  return api.put(`/admin/news/${id}/approve`);
};

export const rejectNews = (id) => {
  return api.put(`/admin/news/${id}/reject`);
};