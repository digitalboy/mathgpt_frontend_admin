<!-- src/views/Students.vue -->
<template>
    <div>
        <h1>学生管理</h1>
        <StudentEdit />
        <StudentList />
    </div>
</template>

<script setup lang="ts">
import StudentList from '@/components/StudentList.vue';  // 导入学生列表组件
import StudentEdit from '@/components/StudentEdit.vue';  // 导入学生编辑组件

</script>

<style scoped></style>
