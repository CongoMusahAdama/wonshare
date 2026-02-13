import axios from 'axios';

// Create an Axios instance with base URL and default headers
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authorization token if available (future use)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Redirect to login or clear token
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
