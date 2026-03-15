import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tourApi = {
  getAllTours: (params) => api.get('/tours', { params }),
  getTourBySlug: (slug) => api.get(`/tours/${slug}`),
  getDepartures: (tourId) => api.get(`/tours/${tourId}/departures`),
};

export const bookingApi = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
};

export const passApi = {
  getPasses: () => api.get('/adventure-passes'),
  orderPass: (orderData) => api.post('/adventure-passes/order', orderData),
};

export const navApi = {
  getMenus: () => api.get('/menus'),
};

export default api;
