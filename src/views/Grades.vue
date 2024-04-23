<!-- src/views/Grades.vue -->
<template>
    <div>
        <GradeEdit />
        <GradeList />
    </div>
</template>

<script setup lang="ts">
import GradeList from '@/components/GradeList.vue';  // 导入年级列表组件
import GradeEdit from '@/components/GradeEdit.vue';  // 导入年级编辑组件

</script>

<style scoped></style>
