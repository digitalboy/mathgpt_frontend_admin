<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" @submit.native.prevent="handleLogin" :rules="rules">
            <el-form-item label="Phone Number" prop="phone_number">
                <el-input v-model="loginForm.phone_number" placeholder="Enter your phone number"
                    autocomplete="username"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="Enter your password" show-password
                    autocomplete="current-password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="authStore.isLoginInProgress" native-type="submit">Login</el-button>
            </el-form-item>
        </el-form>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="authStore.isLoggedIn">
            Logged in as: {{ authStore.adminId }}
            <el-button @click="authStore.logout">Logout</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();
const loginForm = ref({
    phone_number: '',
    password: ''
});
const errorMessage = ref('');

const rules = {
    phone_number: [
        { required: true, message: 'Please input your phone number', trigger: 'blur' },
        { min: 11, max: 11, message: 'Phone number must be 11 digits', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Please input your password', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
    ]
};

const handleLogin = async () => {
    try {
        await authStore.login(loginForm.value.phone_number, loginForm.value.password);
        if (authStore.isLoggedIn) {
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
    }
};
</script>

<style scoped>
.login-container {
    width: 300px;
    margin: 50px auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: red;
    margin-top: 10px;
}

.el-form-item {
    margin-bottom: 20px;
}
</style>
