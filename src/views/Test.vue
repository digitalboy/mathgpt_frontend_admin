<!-- src/views/Test.vue -->
<template>
    <h1>知识图谱</h1>
    <el-row :gutter="20">
        <el-col :span="24">
            <GraphVisualizeGuest />
        </el-col>

    </el-row>
    <NodeEdit />
</template>

<script setup lang="ts">

import GraphVisualizeGuest from '@/components/GraphVisualizeGuest.vue';
// import GraphVisualize from '@/components/GraphVisualizeGuest.vue';  // 导入图谱可视化组件
console.log("GraphVisualizeGuest")


</script>

<style scoped></style>
