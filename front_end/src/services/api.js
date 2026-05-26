import axios from "axios";

export const AUTH_STORAGE_KEY = "wasteiq-auth";
const envApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "/backend";
const apiBaseUrl = envApiUrl.replace(/\/+$/, "") || "/backend";

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth();

  if (storedAuth?.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`;
  }

  return config;
});

export function getStoredAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function storeAuth(value) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function signupUser(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logoutUser() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function predictWaste(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function savePrediction(payload) {
  const { data } = await api.post("/predictions", payload);
  return data;
}

export async function fetchPredictionHistory() {
  const { data } = await api.get("/predictions");
  return data;
}

export async function fetchPredictionDetail(predictionId) {
  const { data } = await api.get(`/predictions/${predictionId}`);
  return data;
}

export async function deletePrediction(predictionId) {
  const { data } = await api.delete(`/predictions/${predictionId}`);
  return data;
}
