import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Change this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMenuItems = () => api.get("/menu-items/");
// export const getMenuItem = (id) => api.get(`/menu-items/${id}/`);
// export const getCategories = () => api.get("/categories/");
export const getOrders = () => api.get("/orders/");