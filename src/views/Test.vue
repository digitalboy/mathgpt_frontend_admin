<!-- src/views/Test.vue -->
<template>
    <div>
        <h1>测试</h1>
        <GradeDropdown />
        <ClassDropdown />
        <SubjectDropdown />
        <SchoolDropdown />
        <TextbookVersionDropdown />
        <StudentDropdown />
        <QuestionDesign />
    </div>
</template>

<script setup lang="ts">
import GradeDropdown from '@/components/GradeDropdown.vue';
import ClassDropdown from '@/components/ClassDropdown.vue';
import SubjectDropdown from '@/components/SubjectDropdown.vue';
import SchoolDropdown from '@/components/SchoolDropdown.vue';
import TextbookVersionDropdown from '@/components/TextbookVersionDropdown.vue';
import StudentDropdown from '@/components/StudentDropdown.vue';
import QuestionDesign from '@/components/QuestionDesign.vue';
</script>

