<!-- src/views/Grades.vue -->
<template>
    <div>
        <h1>试题设计</h1>
        <GradeDropdown/>
        <ClassDropdown/>
        <QuestionDesign/>
    </div>
</template>

<script setup lang="ts">
import GradeDropdown from '@/components/GradeDropdown.vue';
import ClassDropdown from '@/components/ClassDropdown.vue';
import QuestionDesign from '@/components/QuestionDesign.vue';

</script>

<style scoped></style>
