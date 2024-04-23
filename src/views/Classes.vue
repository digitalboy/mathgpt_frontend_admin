<!-- src/views/Classes.vue -->
<template>
    <div>
        <ClassEdit />
        <ClassList />
    </div>
</template>

<script setup lang="ts">
import ClassList from '@/components/ClassList.vue';  // 导入班级列表组件
import ClassEdit from '@/components/ClassEdit.vue';  // 导入班级编辑组件

</script>

<style scoped></style>
