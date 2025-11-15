/**
 * API Service Module
 * 
 * This module provides a centralized Axios instance with empty request and response interceptors
 * for handling authentication and error handling
 * 
 * @module service/api
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

/**
 * @example
 * 
 * // basic usage with useQuery (*recommended*) (has built in caching)
 * import api from './services/api';
 * 
 * const { data, isError, isLoading } = useQuery<User>({
 *     queryKey: 'queryKey',
 *     queryFn: () => api.get('/getUsername'),
 *     staleTime: 5 * 60 * 1000,  // 5 minutes (optional)
 *     cacheTime: 30 * 60 * 1000, // 30 minutes (optional)
 *     refetchOnWindowFocus: true, // (optional)
 *     retry: 2, // (optional)
 * });
 * 
 * OR if you would like to not use useQuery, you can use the following (*not recommended*)
 * try{
 *     const response = await api.get('/getUsername');
 *     return response.data;
 * } catch (error) {
 *     if (axios.isAxiosError(error)) {
 *         // Handle specific error cases here
 *         throw error;
 *     }
 *     throw error;
 * }
 */

class Api {
    private instance: AxiosInstance;
    private defaultConfig: AxiosRequestConfig = {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
        withCredentials: true,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    constructor(config: AxiosRequestConfig = {}) {
        this.instance = axios.create({
            ...this.defaultConfig,
            ...config
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor: add any tokens needed for requests
        this.instance.interceptors.request.use(
            (config) => {
                // const token = localStorage.getItem('token');
                // if (token) {
                //     config.headers.Authorization = `Bearer ${token}`;
                // }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor: handle any generic errors
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                // if (error.response?.status === 401) {
                //     // Handle unauthorized
                //     console.error('Unauthorized access - please login');
                //     // Optionally redirect to login
                //     // window.location.href = '/login';
                // }
                return Promise.reject(error);
            }
        );
    }

    // Generic request method
    public async request<T>(config: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.instance.request<T>(config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle specific error cases here
                throw error;
            }
            throw error;
        }
    }

    // Convenience methods
    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'GET', url, ...config });
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'POST', url, data, ...config });
    }

    public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'PUT', url, data, ...config });
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'DELETE', url, ...config });
    }
}

// Create a singleton instance
const api = new Api();

export default api;