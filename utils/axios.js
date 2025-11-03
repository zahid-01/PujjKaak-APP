import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URI } from "@/constants/baseUri";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      try {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("user");
        // Navigate to login will be handled by root layout
      } catch (e) {
        console.error("Error clearing auth data:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

