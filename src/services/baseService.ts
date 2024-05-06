// services/baseService.ts
import axios, { AxiosInstance } from 'axios';

export class BaseService {
    protected static axiosInstance: AxiosInstance = axios.create({
        // baseURL: 'http://127.0.0.1:5000',
        baseURL: 'https://math.beike.ai/api',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    });

    // 新添加的axios实例用于 "/ai/" 路径下的端点
    protected static axiosAIInstance: AxiosInstance = axios.create({
        // baseURL: 'http://127.0.0.1:5000',
        baseURL: 'https://math.beike.ai/ai',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    });

    static initialize() {
        this.initializeResponseInterceptor();
        this.initializeRequestInterceptor();
    }

    private static initializeRequestInterceptor() {
        this.axiosInstance.interceptors.request.use(
            config => {
                // 确保登录接口调用时不设置 Authorization
                if (!config.url?.endsWith('/admin/login')) {
                    const token = this.getToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // 初始化 "/ai/" 端点的请求拦截器
        this.axiosAIInstance.interceptors.request.use(
            config => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );
    }

    private static initializeResponseInterceptor() {
        this.axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    this.handleAuthenticationError();
                }
                return Promise.reject(error);
            }
        );

        // 初始化 "/ai/" 端点的响应拦截器
        this.axiosAIInstance.interceptors.response.use(
            response => response,
            error => Promise.reject(error)
        );
    }

    protected static getToken(): string | null {
        return localStorage.getItem('token');
    }

    protected static handleAuthenticationError() {
        console.error('Authentication error, redirecting...');
        // Redirect to login page or perform token refresh
    }

    protected static handleError(error: any): void {
        console.error('API call failed:', error);
        throw error;
    }
}

// Make sure to initialize interceptors
BaseService.initialize();
