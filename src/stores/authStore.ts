// src\stores\authStore.ts

import { defineStore } from 'pinia';
import { AdminService } from '../services/adminService';

interface AuthState {
    accessToken: string;
    adminId: number | null;
    lastLoginTime: Date | null;
    isLoginInProgress: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: localStorage.getItem('token') || '',
        adminId: null,
        lastLoginTime: null,
        isLoginInProgress: false
    }),
    getters: {
        isLoggedIn: (state) => !!state.accessToken
    },
    actions: {
        async login(phoneNumber: number, password: string) {
            if (!this.isLoginInProgress) {
                this.isLoginInProgress = true;
                try {
                    const now = new Date();
                    if (this.lastLoginTime && (now.getTime() - this.lastLoginTime.getTime()) < 30000) {
                        throw new Error("Please wait before attempting to login again.");
                    }
                    this.lastLoginTime = now;
                    const response = await AdminService.login({ phone_number: phoneNumber, password });
                    this.accessToken = response.access_token;
                    this.adminId = response.admin_id;
                    localStorage.setItem('token', response.access_token);
                } catch (error) {
                    throw error;
                } finally {
                    this.isLoginInProgress = false;
                }
            }
        },
        logout() {
            this.accessToken = '';
            this.adminId = null;
            localStorage.removeItem('token');
        }
    }
});
