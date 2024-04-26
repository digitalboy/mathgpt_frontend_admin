<template>
    <div class="login-container">
        <el-form :model="loginForm" @submit.native.prevent="handleLogin" :rules="rules">
            <el-form-item label="角色" prop="role">
                <el-select v-model="loginForm.role" placeholder="Select role">
                    <el-option label="管理员" value="admin"></el-option>
                    <el-option label="学生" value="student"></el-option>
                    <!-- 添加其他角色的选项 -->
                </el-select>
            </el-form-item>
            <el-form-item label="手机" prop="phone_number">
                <el-input v-model="loginForm.phone_number" placeholder="Enter your phone number"
                    autocomplete="username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="Enter your password" show-password
                    autocomplete="current-password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="isLoginInProgress" native-type="submit">Login</el-button>
            </el-form-item>
        </el-form>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="authStore.user">
            Logged in as: {{ authStore.user.name }}
            <el-button @click="logout">Logout</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ElMessage} from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

type UserRole = 'admin' | 'student' | 'teacher' | 'parent' | 'principal'; // 将其他角色类型也加入到联合类型中

const loginForm = reactive({
    role: null as unknown as UserRole,
    phone_number: '',
    password: '',
});
const errorMessage = ref('');

// Add role to validation rules
const rules = {
    role: [{ required: true, message: 'Please select your role', trigger: 'change' }],
    phone_number: [
        { required: true, message: 'Please input your phone number', trigger: 'blur' },
        { min: 11, max: 11, message: 'Phone number must be 11 digits', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Please input your password', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
    ]
};

const isLoginInProgress = ref(false);

// Updated login handler
const handleLogin = async () => {
    errorMessage.value = '';
    try {
        isLoginInProgress.value = true;
        await authStore.login(loginForm.role, loginForm.phone_number, loginForm.password);

        if (authStore.user) {
            ElMessage({
                message: 'Login successful',
                type: 'success',
                duration: 3000
            });
            router.push('/dashboard');
        }
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
        ElMessage({
            message: msg,
            type: 'error',
            duration: 3000
        });
        errorMessage.value = msg;
    } finally {
        isLoginInProgress.value = false;
    }
};

// Logout method
const logout = () => {
    authStore.logout(); // Ensure this method exists and is properly implemented in authStore
    router.push('/login');
};
</script>

<style scoped>

</style>