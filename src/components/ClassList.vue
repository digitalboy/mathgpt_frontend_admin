<!-- src/components/ClassList.vue -->
<template>
    <el-table :data="classes">
        <el-table-column prop="name" label="班级名称"></el-table-column>
        <el-table-column prop="school_name" label="学校名称"></el-table-column>
        <el-table-column prop="grade_id" label="年级ID"></el-table-column>
        <el-table-column prop="grade_name" label="年级名称"></el-table-column>
        <el-table-column prop="num_of_students" label="学生人数"></el-table-column>
        <el-table-column prop="description" label="班级介绍"></el-table-column>
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="primary" :icon="Edit" circle @click="editClass(row)" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useClassStore } from '@/stores/classStore'; // 导入班级的状态管理
import { Class } from '@/services/classService';
import { Edit } from '@element-plus/icons-vue';

const classStore = useClassStore(); // 使用班级的状态存储
const classes = computed(() => classStore.classes); // 使用计算属性来响应状态变化

const editClass = (classInfo: Class) => {
    classStore.setCurrentClass(classInfo);
    console.log('当前编辑的班级已保存：', classInfo);    
};

onMounted(() => {
    if (classes.value.length === 0) {
        classStore.fetchClasses().catch(error => {
            ElMessage.error('加载班级数据失败: ' + error.message);
        });
    }
});
</script>

<style scoped></style>
