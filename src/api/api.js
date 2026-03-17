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

export const adminApi = {
  // Tours
  getAllTours: (params) => api.get('/admin/tours', { params }),
  createTour: (data) => api.post('/admin/tours', data),
  updateTour: (id, data) => api.put(`/admin/tours/${id}`, data),
  deleteTour: (id) => api.delete(`/admin/tours/${id}`),

  // Bookings
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
  updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),

  // Passes
  getAllPasses: () => api.get('/admin/adventure-passes'),
  createPass: (data) => api.post('/admin/adventure-passes', data),
  updatePass: (id, data) => api.put(`/admin/adventure-passes/${id}`, data),
  deletePass: (id) => api.delete(`/admin/adventure-passes/${id}`),

  // Pass Orders
  getPassOrders: (params) => api.get('/admin/pass-orders', { params }),
  updatePassOrderStatus: (id, status) => api.patch(`/admin/pass-orders/${id}/status`, { status }),
};

export default api;
