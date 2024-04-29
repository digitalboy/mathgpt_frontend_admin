// src/components/NeighborhoodDialog.vue
<template>
    <el-dialog title="邻近节点和边信息" v-model="neighborhoodVisible">
        <div v-if="graphData">
            <div v-for="(value, key) in graphData.nodes" :key="key">
                <strong>节点：</strong>{{ value }}
            </div>
            <div v-for="(value, key) in graphData.edges" :key="key">
                <strong>边：</strong>{{ value }}
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { GraphData } from '@/services/graphService';

const graphStore = useGraphStore();
const neighborhoodVisible = ref(false);
const graphData = ref<GraphData | undefined>();

watch(() => graphStore.currentNode, async (newNode) => {
    if (newNode) {
        graphData.value = await graphStore.getNeighborhood(newNode.properties.uuid);
        neighborhoodVisible.value = true;
    }
}, { immediate: true });

watch(neighborhoodVisible, (newValue) => {
    console.log("close")
    if (!newValue) {
        graphStore.setCurrentNode(null); // 当对话框关闭时清除当前节点状态
    }
});

</script>