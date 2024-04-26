// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { AdminService } from '@/services/adminService';
import { StudentService } from '@/services/studentService';

export interface AuthState {
    user: {
        id: number,       
        role: 'admin' | 'student' | 'teacher' | 'parent' | 'principal',
        access_token: string,
        isLoggedIn: boolean;
        // 学生特有的信息字段
        name?: string,
        class_id?: number, // 班级ID
        class_name?: string, // 班级名称
        grade_id?: number, // 年级ID
        grade_name?: string, // 年级名称
        school_id?: number, // 学校ID
        school_name?: string, // 学校名称
        phone_number?: string, // 手机号
        last_login_at?: string, // 最后登录时间
        created_at?: string, // 账号创建时间
        updated_at?: string, // 账号更新时间
    } | null;
}

export const useAuthStore = defineStore('authStore', {
    state: (): AuthState => ({
        user: null,
    }),
    actions: {
        // 一个统一的登录方法，支持所有角色类型
        async login(role: 'admin' | 'student' | 'teacher' | 'parent' | 'principal', phoneNumber: string, password: string) {
            let response:any;
            if (role === 'admin') {
                response = await AdminService.login({ phone_number: phoneNumber, password });
            } else if (role === 'student') {
                response = await StudentService.loginStudent(phoneNumber, password);
            }
            // 处理登录成功后的逻辑，例如保存用户信息
            if (response) {
                this.user = {
                    id: response.id,                    
                    role: response.role,
                    access_token: response.access_token,
                    isLoggedIn:true,
                    // 根据角色类型，保存额外的信息
                    ...(response.role === 'student' && {
                        name: response.name,
                        class_id: response.class_id,
                        class_name: response.class_name,
                        grade_id: response.grade_id,
                        grade_name: response.grade_name,
                        school_id: response.school_id,
                        school_name: response.school_name,
                        phone_number: response.phone_number,
                        last_login_at: response.last_login_at,
                    }),
                    created_at: response.created_at,
                    updated_at: response.updated_at,
                };

                // 保存用户信息到本地存储中，以便在刷新页面后还能够读取到
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        },
        // 登出 action 实现
        logout() {
            // 清除用户状态
            this.user = null;

            // 清除本地存储中的用户信息
            localStorage.removeItem('user');

            // 可以添加更多清理逻辑，如清除 cookies、tokens 等
        },
        initializeAuth() {
            const userString = localStorage.getItem('user');
            if (userString) {
                const userData = JSON.parse(userString);
                this.user = {
                    ...userData,
                    isLoggedIn: true
                };
            }
        },
    },
});