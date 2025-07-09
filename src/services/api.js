import axios from "axios";
import Cookies from 'js-cookie';

const BASE_URL = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
BASE_URL.interceptors.request.use(function (config) {
    // get token from cookies named ACCESS_TOKEN
    const token = Cookies.get('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default BASE_URL;
