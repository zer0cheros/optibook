import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", 
  },
});

export const GetApi = async <T>(url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
    } catch (error) {
    if (error instanceof AxiosError) {
        throw new Error(`GET ${url} failed: ${error.message}`);
    }
    throw error;
    }
};

export const PostApi = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
    } catch (error) {
    if (error instanceof AxiosError) {
        throw new Error(`POST ${url} failed: ${error.message}`);
    }
    throw error;
    }
};