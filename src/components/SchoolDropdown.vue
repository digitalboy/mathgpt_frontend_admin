<!-- // components/SchoolDropdown.vue -->
<template>
    <el-select v-model="selectedSchool" placeholder="请选择学校" @change="handleSchoolChange">
        <el-option v-for="school in schools" :key="school.id" :label="school.name" :value="school">
        </el-option>
    </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSchoolStore } from '@/stores/schoolStore';
import { SchoolService } from '@/services/schoolService';
import { School } from '@/services/schoolService';
import { ElMessage } from 'element-plus';

const schoolStore = useSchoolStore();
const schools = ref < School[] > ([]);
const selectedSchool = ref(null);

const fetchSchools = async () => {
    try {
        const data = await SchoolService.getSchools();
        if (data) {
            schools.value = data;
        } else {
            throw new Error('未能获取学校数据');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('加载学校数据失败: ' + error.message);
        } else {
            ElMessage.error('发生未知错误');
        }
    }
};  

const handleSchoolChange = (newSchool:School) => {
    schoolStore.setCurrentSchool(newSchool);
};

onMounted(() => {
    fetchSchools();
});
</script>

<style scoped></style>
