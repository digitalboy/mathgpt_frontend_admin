<!-- src\components\GradeList.vue -->
<template>
    <el-table :data="grades" style="width: 100%">

        <el-table-column prop="id" label="年级ID"></el-table-column>
        <el-table-column prop="name" label="年级名称"></el-table-column>
        <el-table-column prop="description" label="年级介绍"></el-table-column>
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="primary" :icon="Edit" circle @click="editGrade(row)" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useGradeStore } from '@/stores/gradeStore';
import { Grade } from '@/services/gradeService';
import { Edit } from '@element-plus/icons-vue';

const gradeStore = useGradeStore();
const grades = computed(() => gradeStore.grades);

const editGrade = (grade: Grade) => {
    gradeStore.setCurrentGrades([grade]); // 将单个年级对象包装在数组中
};

onMounted(() => {
    if (grades.value.length === 0) {
        gradeStore.fetchGrades().catch(error => {
            ElMessage.error('加载年级数据失败: ' + error.message);
        });
    }
});
</script>

<style scoped></style>
