<template>
    <div class="app-header">
        <el-row :gutter="20">
            <el-col :span="9">LOGO</el-col>
            <el-col :span="3">
                访客
            </el-col>
            <el-col :span="3"><textbook-version-dropdown /></el-col>
            <el-col :span="3"><grade-dropdown /></el-col>
            <el-col :span="3"><subject-dropdown /></el-col>
            <el-col :span="3">
                <relationship-select />
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import GradeDropdown from '@/components/GradeDropdown.vue';
import SubjectDropdown from '@/components/SubjectDropdown.vue';
import RelationshipSelect from '@/components/RelationshipSelect.vue';
import TextbookVersionDropdown from '@/components/TextbookVersionDropdown.vue';
</script>

<style scoped>
.app-header {
    padding: 10px;
    background-color: #3c7fb6;
    color: white;
}
</style>
