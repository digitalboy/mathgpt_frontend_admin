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
        <el-col :span="16">
            <GraphVisualize />
        </el-col>
        <el-col :span="8">
            <KPExplanationEdit :nodeUuid="nodeUuid" />
        </el-col>
    </el-row>
    <NodeEdit />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import GraphVisualize from '@/components/GraphVisualize.vue';  // 导入图谱可视化组件
import NodeEdit from '@/components/NodeEdit.vue';
import GradeDropdown from '@/components/GradeDropdown.vue';
import SubjectDropdown from '@/components/SubjectDropdown.vue';
import KPExplanationEdit from '@/components/KPExplanationEdit.vue';

import { useGraphStore } from '@/stores/graphStore';

const graphStore = useGraphStore();

const nodeUuid = ref("")

watch(() => graphStore.currentNode, (newNode) => {
    if (newNode) {
        nodeUuid.value = newNode.properties.uuid;
        console.log(nodeUuid.value)
    }
}, { immediate: true });

</script>

<style scoped></style>
