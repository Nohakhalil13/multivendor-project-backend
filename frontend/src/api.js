import axios from "axios";

/**
 * Tradify API Core Configuration
 * Uses environment variables for flexible deployment (Dev/Prod).
 */
const API = axios.create({
  // استبدلنا الرابط المباشر بمتغير البيئة
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @description Fetches all available products from the database.
 * @returns {Promise<Array>} A list of product objects.
 */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // تأكدي إن الاسم هنا نفس اللي في صفحة الـ Login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data?.data?.products || [];
  } catch (error) {
    console.error("API_ERROR [getProducts]:", error.message);
    throw new Error(
      "Could not retrieve products. Please check your connection.",
    );
  }
};

/**
 * @description Retrieves all product categories.
 */
export const getCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data?.data?.categories || response.data?.data || [];
  } catch (error) {
    console.error("API_ERROR [getCategories]:", error.message);
    return [];
  }
};

/**
 * @description Fetches detailed information for a specific product.
 */
export const getProductDetails = async (id) => {
  if (!id) return null;
  try {
    const response = await API.get(`/products/${id}`);
    return response.data?.data?.product || response.data?.data || null;
  } catch (error) {
    console.error(`API_ERROR [getProductDetails] for ID ${id}:`, error.message);
    return null;
  }
};

/**
 * @description Add product to server-side cart
 */
export const addToCartAPI = async (productId, quantity = 1) => {
    try {
        const response = await API.post('/cart', { productId, quantity });
        return response.data;
    } catch (error) {
        console.error("API_ERROR [addToCartAPI]:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * @description Fetch user's cart from server
 */
export const getCartAPI = async () => {
    try {
        const response = await API.get('/cart');
        return response.data?.data?.cartItems || response.data?.items || [];
    } catch (error) {
        console.error("API_ERROR [getCartAPI]:", error.response?.data || error.message);
        throw error;
    }
};

export default API;
