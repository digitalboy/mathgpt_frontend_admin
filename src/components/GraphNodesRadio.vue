<template>
    <el-radio-group class="radio-group" v-model="selectedNodeId" @change="handleNodeChange">
        <el-radio v-for="node in nodes" :key="node.properties.uuid" :label="node.properties.uuid" class="radio-item">
            {{ node.properties.node_name }}
        </el-radio>
    </el-radio-group>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useGraphStore } from '@/stores/graphStore';

const graphStore = useGraphStore();
const selectedNodeId = ref('');

// 计算属性以响应式方式获取节点
const nodes = computed(() => graphStore.nodes);

// 监听节点选择的变化
const handleNodeChange = (newNodeId: string) => {
    // 找到被选择的节点对象
    const selectedNode = graphStore.nodes.find(node => node.properties.uuid === newNodeId);
    graphStore.setCurrentNode(selectedNode || null);
};

// 在组件挂载时获取节点和边数据
onMounted(async () => {
    console.log("开始加载图形数据...");
    await graphStore.fetchNodesAndEdges();
    console.log("加载图形数据完成:", graphStore.nodes, graphStore.edges);
});
</script>

<style scoped>
.radio-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.radio-item {
    margin-right: 10px;
    /* 添加一些右边距 */
    min-width: 70px;
    /* 设定一个最小宽度 */
    width: 150px;
    /* 设定具体宽度 */
    white-space: nowrap;
    /* 防止文本换行 */
    overflow: hidden;
    /* 隐藏溢出部分 */
    text-overflow: ellipsis;
    /* 使用省略号表示被截断的文本 */
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}
</style>


