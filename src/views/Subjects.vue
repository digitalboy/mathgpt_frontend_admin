<!-- src/views/Subjects.vue -->
<template>
    <div>
        <h1>学科管理</h1>
        <SubjectEdit />
        <SubjectList />
    </div>
</template>

<script setup lang="ts">
import SubjectList from '@/components/SubjectList.vue';  // 导入学科列表组件
import SubjectEdit from '@/components/SubjectEdit.vue';  // 导入学科编辑组件

</script>

<style scoped></style>
