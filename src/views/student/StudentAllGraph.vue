<!-- src/views/Graph.vue -->
<template>
    <h1>知识图谱</h1>
    <el-row :gutter="20">
        <el-col :span="24">
            <GraphVisualize class="graph" />
        </el-col>
    </el-row>   
</template>

<script setup lang="ts">
import GraphVisualize from '@/components/GraphVisualize.vue';  // 导入图谱可视化组件
</script>

<style scoped>

</style>
