<!-- src/components/StudentList.vue -->
<template>
    <el-table :data="students" style="width: 100%">
        <el-table-column prop="id" label="学生ID"></el-table-column>
        <el-table-column prop="name" label="学生名称"></el-table-column>
        <el-table-column prop="class_name" label="班级"></el-table-column>
        <el-table-column prop="grade_name" label="年级"></el-table-column>
        <el-table-column prop="school_name" label="学校"></el-table-column>
        <el-table-column prop="phone_number" label="电话号码"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="updated_at" label="更新时间"></el-table-column>
        <el-table-column prop="last_login_at" label="最后登录时间"></el-table-column>
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="primary" :icon="Edit" circle @click="editStudent(row)" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useStudentStore } from '@/stores/studentStore'; // 确保已经在 stores 中定义了 studentStore
import { Student } from '@/services/studentService';
import { Edit } from '@element-plus/icons-vue';

const studentStore = useStudentStore();
const students = computed(() => studentStore.students);

const editStudent = (student: Student) => {
    studentStore.setCurrentStudent(student);
    console.log(student)
};

onMounted(() => {
    if (students.value.length === 0) {
        studentStore.fetchStudents().catch(error => {
            ElMessage.error('加载学生数据失败: ' + error.message);
        });
    }
});
</script>

<style scoped></style>
