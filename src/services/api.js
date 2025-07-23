import axios from "axios";
import Cookies from 'js-cookie';

const BASE_URL = axios.create({
    baseURL: 'https://localhost:7163/', // Use proxy instead of direct HTTPS URL
    headers: {
        'Content-Type': 'application/json',
    }
});

BASE_URL.interceptors.request.use(function (config) {
    // Try to get token from both localStorage and cookies
    const tokenFromLocalStorage = localStorage.getItem('token');
    const tokenFromCookies = Cookies.get('ACCESS_TOKEN');
    const token = tokenFromLocalStorage || tokenFromCookies;
    
    console.log('Token from localStorage:', tokenFromLocalStorage); // Debug log
    console.log('Token from cookies:', tokenFromCookies); // Debug log
    console.log('Using token:', token); // Debug log
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set:', config.headers.Authorization); // Debug log
    } else {
        console.warn('No token found in localStorage or cookies'); // Debug log
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Debug response interceptor
BASE_URL.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.error('API Error:', error.response?.status, error.response?.data);
        
        // Extract meaningful error message from backend
        let errorMessage = 'Có lỗi xảy ra khi kết nối đến server';
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
            }
        }
        
        if (error.response?.status === 401) {
            console.error('Unauthorized - Token may be invalid or expired');
            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response?.status === 400) {
            console.error('Bad Request:', errorMessage);
        }
        
        // Create new error with meaningful message
        const enhancedError = new Error(errorMessage);
        enhancedError.status = error.response?.status;
        enhancedError.originalError = error;
        
        return Promise.reject(enhancedError);
    }
);

export default BASE_URL;
