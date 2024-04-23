<!-- components/SchoolDropdown.vue -->
<template>
    <el-select v-model="selectedSchool" placeholder="请选择学校" @change="handleSchoolChange">
        <el-option v-for="school in schools" :key="school.id" :label="school.name" :value="school">
        </el-option>
    </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSchoolStore } from '@/stores/schoolStore';
import { School } from '@/services/schoolService';
import { ElMessage } from 'element-plus';

const schoolStore = useSchoolStore();
const selectedSchool = ref<School | null>(null);

// 使用Pinia状态管理获取schools数组
const schools = ref<School[]>(schoolStore.schools);

const handleSchoolChange = (newSchool: School) => {
    schoolStore.setCurrentSchool(newSchool);
};

onMounted(() => {
    if (schoolStore.schools.length === 0) {
        schoolStore.fetchSchools().catch(error => {
            ElMessage.error('加载学校数据时发生错误: ' + error.message);
        });
    } else {
        schools.value = schoolStore.schools;  // 确保组件获取到最新的学校数据
    }
});
</script>

<style scoped></style>
