// services/baseService.ts

import axios from 'axios';

export class BaseService {
    protected static axiosInstance = axios.create({
        baseURL: 'https://math.beike.ai/api',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    protected static handleError(error: any): void {
        // 统一的错误处理逻辑
        console.error('API call failed:', error);
        throw error;
    }
}
