// services/adminService.ts
import { BaseService } from './baseService';

interface LoginResponse {
    access_token: string;
    admin_id: number;
}

interface LoginCredentials {
    phone_number: string;
    password: string;
}

export class AdminService extends BaseService {
    // 实现管理员登录的函数
    public static async login(credentials: LoginCredentials): Promise<LoginResponse> {
        console.log('开始登录...');
        try {
            const response = await this.axiosInstance.post<LoginResponse>('/admin/login', {
                phone_number: credentials.phone_number,
                password: credentials.password
            });
            if (response.data.access_token) {
                console.log('登录成功！');
                localStorage.setItem('token', response.data.access_token); // 保存 access_token
            }
            return response.data; // 明确返回响应数据
        } catch (error) {
            console.error('登录失败！', error);
            this.handleError(error); // 统一的错误处理
            throw error; // 抛出错误以确保返回类型的一致性
        }
    }
}
