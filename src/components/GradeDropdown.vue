<!-- src/components/GradeDropdown.vue -->
<template>
    <el-select v-model="selectedGrade" placeholder="请选择年级" @change="handleGradeChange">
        <el-option v-for="grade in grades" :key="grade.id" :label="grade.name" :value="grade">
        </el-option>
    </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGradeStore } from '@/stores/gradeStore';
import { Grade } from '@/services/gradeService';
import { ElMessage } from 'element-plus';

const gradeStore = useGradeStore();
const selectedGrade = ref<Grade | null>(null);

// 使用Pinia状态管理获取grades数组
const grades = ref<Grade[]>(gradeStore.grades);

const handleGradeChange = (newGrade: Grade) => {
    gradeStore.setCurrentGrade(newGrade);
};

onMounted(() => {
    if (gradeStore.grades.length === 0) {
        gradeStore.fetchGrades().catch(error => {
            ElMessage.error('加载年级数据时发生错误: ' + error.message);
        });
    } else {
        grades.value = gradeStore.grades;  // 确保组件获取到最新的年级数据
    }
});
</script>

<style scoped></style>
