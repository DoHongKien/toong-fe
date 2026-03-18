import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: chỉ gắn JWT vào request admin (trừ login)
// Web client public routes không cần token
api.interceptors.request.use((config) => {
  const isAdminEndpoint = config.url?.includes("/admin/");
  const isLoginEndpoint = config.url?.includes("/admin/auth/login");
  if (isAdminEndpoint && !isLoginEndpoint) {
    const token = localStorage.getItem("toong_cms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: nếu 401 và đang KHÔNG ở trang login → xoá token + redirect
// (tránh reload vô tận khi đăng nhập sai vì API trả 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/cms/login")
    ) {
      localStorage.removeItem("toong_cms_token");
      localStorage.removeItem("toong_cms_user");
      window.location.href = "/cms/login";
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (credentials) => api.post("/admin/auth/login", credentials),
};

export const tourApi = {
  getAllTours: (params) => api.get("/tours", { params }),
  getTourBySlug: (slug) => api.get(`/tours/${slug}`),
  getDepartures: (tourId) => api.get(`/tours/${tourId}/departures`),
};

export const bookingApi = {
  createBooking: (bookingData) => api.post("/bookings", bookingData),
};

export const passApi = {
  getPasses: () => api.get("/adventure-passes"),
  orderPass: (orderData) => api.post("/adventure-passes/order", orderData),
};

export const navApi = {
  getMenus: () => api.get("/menus"),
};

export const adminApi = {
  // Tours
  getAllTours: (params) => api.get("/admin/tours", { params }),
  createTour: (data) => api.post("/admin/tours", data),
  updateTour: (id, data) => api.put(`/admin/tours/${id}`, data),
  deleteTour: (id) => api.delete(`/admin/tours/${id}`),

  // Bookings
  getAllBookings: (params) => api.get("/admin/bookings", { params }),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
  updateBookingStatus: (id, status) =>
    api.patch(`/admin/bookings/${id}/status`, { status }),

  // Passes
  getAllPasses: (body = {}) => api.post("/admin/adventure-passes", body),
  createPass: (data) => api.post("/admin/adventure-passes", data),
  updatePass: (id, data) => api.put(`/admin/adventure-passes/${id}`, data),
  deletePass: (id) => api.delete(`/admin/adventure-passes/${id}`),

  // Pass Orders
  getPassOrders: (params) => api.get("/admin/pass-orders", { params }),
  updatePassOrderStatus: (id, status) =>
    api.patch(`/admin/pass-orders/${id}/status`, { status }),

  // Banners
  getAllBanners: () => api.get("/admin/banners"),
  createBanner: (data) => api.post("/admin/banners", data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
  patchBanner: (id, data) => api.patch(`/admin/banners/${id}`, data),

  // Blog Posts
  getAllBlogPosts: (params) => api.get("/admin/blog-posts", { params }),
  createBlogPost: (data) => api.post("/admin/blog-posts", data),
  updateBlogPost: (id, data) => api.put(`/admin/blog-posts/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/admin/blog-posts/${id}`),

  // FAQs
  getAllFaqs: () => api.get("/admin/faqs"),
  createFaq: (data) => api.post("/admin/faqs", data),
  updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),

  // Contact Messages
  getAllContacts: (params) => api.get("/admin/contact-messages", { params }),
  updateContactStatus: (id, status) =>
    api.patch(`/admin/contact-messages/${id}/status`, { status }),
  deleteContact: (id) => api.delete(`/admin/contact-messages/${id}`),

  // Employees (Staff)
  getAllEmployees: (params) => api.get("/admin/employees", { params }),
  createEmployee: (data) => api.post("/admin/employees", data),
  updateEmployee: (id, data) => api.put(`/admin/employees/${id}`, data),
  updateEmployeeStatus: (id, status) =>
    api.patch(`/admin/employees/${id}/status`, { status }),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),

  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
};

export default api;
