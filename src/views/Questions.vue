<!-- src/views/Grades.vue -->
<template>
    <div>
        <h1>试题管理</h1>
        <GradeDropdown/>
        <ClassDropdown/>
    </div>
</template>

<script setup lang="ts">
import GradeDropdown from '@/components/GradeDropdown.vue';
import ClassDropdown from '@/components/ClassDropdown.vue';


</script>

<style scoped></style>
