<!-- src/components/NodeList.vue -->
<template>
    <el-table :data="nodes" style="width: 100%">

        <el-table-column prop="labels" label="节点标签"></el-table-column>
        <el-table-column prop="properties.node_name" label="节点名称"></el-table-column>
        <el-table-column prop="properties.grade" label="年级"></el-table-column>
        <el-table-column prop="properties.subject" label="学科"></el-table-column>
        <el-table-column prop="properties.publisher" label="出版商"></el-table-column>
        <el-table-column prop="properties.description" label="描述"></el-table-column>
        <el-table-column prop="properties.uuid" label="UUID"></el-table-column>

        <!-- 如果有特定的操作需求，可以在这里添加操作列 -->
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="primary" circle @click="editNode(row)">编辑</el-button>
            </template>
        </el-table-column>

    </el-table>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useGraphStore } from '@/stores/graphStore';
import { Node } from '@/services/graphService';

const graphStore = useGraphStore();
const nodes = computed(() => graphStore.nodes);

const editNode = (node: Node) => {
    graphStore.setCurrentNode(node);  // 设置为当前节点
    console.log('当前编辑的节点:', graphStore.currentNode);  // 可以选择调试信息
    // 你可以在这里添加逻辑来展示节点详情或触发一个编辑节点信息的对话框
};

// 加载节点信息
onMounted(() => {
    if (nodes.value.length === 0) {
        graphStore.fetchNodesAndEdges().catch(error => {
            ElMessage.error('加载节点数据失败: ' + error.message);
        });
    }
});
</script>

<style scoped></style>