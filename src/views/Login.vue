<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="phone_number">Phone Number</label>
                <input id="phone_number" v-model="phone_number" type="text" placeholder="Enter your phone number" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" v-model="password" type="password" placeholder="Enter your password" />
            </div>
            <button type="submit" :disabled="authStore.isLoginInProgress">Login</button>
        </form>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p v-if="authStore.isLoggedIn">Logged in as: {{ authStore.adminId }}</p>
        <button v-if="authStore.isLoggedIn" @click="authStore.logout">Logout</button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const phone_number = ref < string > ('');
const password = ref < string > ('');
const errorMessage = ref < string > ('');

const handleLogin = async () => {
    console.log("LLL")
    try {
        await authStore.login(parseInt(phone_number.value, 11), password.value);
        if (authStore.isLoggedIn) {
            console.log("authStore.isLoggedIn")
            router.push('/dashboard');
        }
    } catch (error) {
        if (error instanceof Error) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = 'An unknown error occurred.';
        }
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

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
</style>
