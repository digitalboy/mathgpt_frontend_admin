<!-- src/views/Schools.vue -->
<template>
    <div>
        <h1>学校管理</h1>
        <SchoolEdit />
        <SchoolList />
    </div>
</template>

<script setup lang="ts">
import SchoolList from '@/components/SchoolList.vue';
import SchoolEdit from '@/components/SchoolEdit.vue';

</script>

<style scoped></style>
