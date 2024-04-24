<!-- src\components\SchoolDropdown.vue -->
<template>
    <div>
        <el-select v-if="schools.length > 0" v-model="selectedSchoolId" placeholder="请选择学校"
            @change="handleSchoolChange">
            <el-option v-for="school in schools" :key="school.id" :label="school.name" :value="school.id"></el-option>
        </el-select>
        <div v-else>正在加载数据...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useSchoolStore } from '@/stores/schoolStore';
import { ElMessage } from 'element-plus';

const schoolStore = useSchoolStore();
const selectedSchoolId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const schools = computed(() => schoolStore.schools);

// 当选中的学校 ID 变化时，更新当前学校状态
watch(selectedSchoolId, (newId) => {
    if (newId !== null) {
        const school = schools.value.find(s => s.id === newId) || null;  // 确保返回类型为 School 或 null
        schoolStore.setCurrentSchool(school);
    } else {
        schoolStore.setCurrentSchool(null);  // 如果 newId 是 null，则显式设置 currentSchool 为 null
    }
});

const handleSchoolChange = (newSchoolId: number | null) => {
    console.log(`Selected School ID: ${newSchoolId}`);
};

onMounted(async () => {
    // 确保在组件挂载时加载并刷新学校数据
    try {
        await schoolStore.fetchSchools();
        if (schools.value.length > 0) {
            selectedSchoolId.value = schools.value[0].id ?? null; // 默认选择第一个学校
        }
    } catch (error: any) {
        ElMessage.error('加载学校数据时发生错误: ' + error.message);
    }
});
</script>

<style scoped>
/* 添加适当的样式 */
</style>
