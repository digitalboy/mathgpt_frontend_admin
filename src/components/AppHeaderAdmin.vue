<!-- components/AppHeaderAdmin.vue -->
<template>
    <div class="app-header">
        <el-row :gutter="20">
            <el-col :span="15">LOGO</el-col>
            <el-col :span="3">
                管理员：{{ adminId }}
            </el-col>
            <el-col :span="3"><grade-dropdown /></el-col>
            <el-col :span="3"><subject-dropdown /></el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import GradeDropdown from '@/components/GradeDropdown.vue';
import SubjectDropdown from '@/components/SubjectDropdown.vue';

const authStore = useAuthStore();
const adminId = computed(() => authStore.user?.id ?? '未登录');
</script>

<style scoped>
.app-header {
    /* display: flex; */
    /* align-items: center; */
    padding: 10px;
    background-color: #333;
    color: white;
}
</style>
