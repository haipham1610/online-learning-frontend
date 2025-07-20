// src/services/api.js
import axios from 'axios';
const API_BASE_URL = 'https://localhost:5000/api';

class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static get(endpoint, params = {}) {
        // const searchParams = new URLSearchParams(params);
        // const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
        // return this.request(url);//cái này code đúng với truyền giá trị của role

        //code này là test với k truyền role,id để test 
        // 🧹 Bỏ các params null/undefined/"" trước khi tạo query string
        const cleanParams = {};
        for (const key in params) {
            const value = params[key];
            if (value !== null && value !== undefined && value !== '') {
                cleanParams[key] = value;
            }
        }

        const searchParams = new URLSearchParams(cleanParams);
        const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;

        return this.request(url);
    }

    static post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    static put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    static patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    static delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    static downloadFile(endpoint, params = {}) {
        const cleanParams = {};
        for (const key in params) {
            const value = params[key];
            if (value !== null && value !== undefined && value !== '') {
                cleanParams[key] = value;
            }
        }

        const url = `${API_BASE_URL}${endpoint}`;
        return axios.get(url, {
            params: cleanParams,
            responseType: 'blob',
        }).then(res => res.data);
    }
}

export default ApiService;