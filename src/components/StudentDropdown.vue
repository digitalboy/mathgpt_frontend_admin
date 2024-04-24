<!-- src\components\StudentDropdown.vue -->
<template>
    <div>
        <el-select v-if="students.length > 0" v-model="selectedStudentId" placeholder="请选择学生"
            @change="handleStudentChange">
            <el-option v-for="student in students" :key="student.id"
                :label="`${student.name} (${student.grade_name} 【 ${student.class_name}】)`"
                :value="student.id"></el-option>
        </el-select>
        <div v-else>正在加载数据...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStudentStore } from '@/stores/studentStore';
import { ElMessage } from 'element-plus';

const studentStore = useStudentStore();
const selectedStudentId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const students = computed(() => studentStore.students);

// 当选中的学生 ID 变化时，更新当前学生状态
watch(selectedStudentId, (newId) => {
    if (newId !== null) {
        const student = students.value.find(s => s.id === newId) || null;  // 确保返回类型为 Student 或 null
        studentStore.setCurrentStudent(student);
    } else {
        studentStore.setCurrentStudent(null);  // 如果 newId 是 null，则显式设置 currentStudent 为 null
    }
});

const handleStudentChange = (newStudentId: number | null) => {
    console.log(`Selected Student ID: ${newStudentId}`);
};

onMounted(async () => {
    // 确保在组件挂载时加载并刷新学生数据
    try {
        await studentStore.fetchStudents();
        if (students.value.length > 0) {
            selectedStudentId.value = students.value[0].id ?? null; // 默认选择第一个学生
        }
    } catch (error: any) {
        ElMessage.error('加载学生数据时发生错误: ' + error.message);
    }
});
</script>

<style scoped>
/* 添加适当的样式 */
</style>
