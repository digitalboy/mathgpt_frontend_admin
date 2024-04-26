<!-- components/Header.vue -->
<template>
    <div class="app-header">
        <!-- <img src="assets/vue.svg" alt="Logo" class="logo" /> -->
        <div class="student-info">
            {{ studentName }}
            年级：{{ gradeName }}
            班级：{{ className }}
            学校：{{ schoolName }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const studentName = computed(() => authStore.user?.name ?? '未登录');
const gradeName = computed(() => authStore.user?.grade_name ?? '未知年级');
const className = computed(() => authStore.user?.class_name ?? '未知班级');
const schoolName = computed(() => authStore.user?.school_name ?? '未知学校');
</script>

<style scoped>
.app-header {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #333;
    color: white;
}

.logo {
    margin-right: 20px;
    height: 50px;
}

.student-info h1 {
    margin: 0 0 5px 0;
    font-size: 24px;
}

.student-info p {
    margin: 5px 0;
}
</style>