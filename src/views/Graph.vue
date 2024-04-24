<!-- src/views/Graph.vue -->
<template>
    <h1>知识图谱</h1>

    <el-row>
        <el-col :span="12">
            <GradeDropdown />
        </el-col>
        <el-col :span="12">
            <SubjectDropdown />
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <GraphVisualize class="graph"/>
    </el-row>
    <NodeEdit />
</template>

<script setup lang="ts">
import GraphVisualize from '@/components/GraphVisualize.vue';  // 导入图谱可视化组件
import NodeEdit from '@/components/NodeEdit.vue';
import GradeDropdown from '@/components/GradeDropdown.vue';
import SubjectDropdown from '@/components/SubjectDropdown.vue';
</script>

<style scoped>

</style>
