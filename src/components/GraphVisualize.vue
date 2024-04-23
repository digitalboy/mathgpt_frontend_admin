// src/components/GraphVisualize.vue
<template>
    <div ref="visContainer" class="vis-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { Network } from 'vis-network/standalone';
import { ElMessage } from 'element-plus';

const visContainer = ref(null);
const graphStore = useGraphStore();

const graphData = computed(() => {
    return {
        nodes: graphStore.nodes.map(node => ({
            id: node.elementId || node.identity.toString(),
            label: node.properties.node_name,
            title: node.properties.description
        })),
        edges: graphStore.edges.map(edge => ({
            from: edge.start_uuid,
            to: edge.end_uuid,
            label: edge.type,
            title: `Since: ${edge.properties.since}`,
            arrows: 'to'
        }))
    };
});

onMounted(async () => {
    await graphStore.fetchNodesAndEdges();
});

watch(() => [graphStore.nodes, graphStore.edges], ([nodes, edges]) => {
    if (visContainer.value && nodes?.length > 0 && edges?.length > 0) {
        const options = {
            interaction: { hover: true },
            nodes: { shape: 'dot', size: 10 },
            edges: { smooth: true }
        };
        const network = new Network(visContainer.value, graphData.value, options);

        network.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                // 查找节点时，确保找到的是 Node 类型对象
                const node = graphStore.nodes.find(node => (node.elementId === nodeId || node.identity.toString() === nodeId) && 'elementId' in node);
                if (node) {
                    graphStore.setCurrentNode(node);
                    console.log('Node clicked:', node);
                }
            }
            if (params.edges.length > 0) {
                const edgeId = params.edges[0];
                // 因为边不包含 elementId，所以我们不需要为边执行类似检查
                const edge = graphStore.edges.find(edge => `${edge.start_uuid}-${edge.end_uuid}` === edgeId);
                if (edge) {
                    graphStore.setCurrentEdge(edge);
                    console.log('Edge clicked:', edge);
                }
            }
        });

    } else {
        ElMessage.warning('未加载任何图形数据');
    }
}, {
    immediate: true // 这会立即触发依赖变化的监视
});
</script>



<style scoped>
.vis-container {
    width: 100%;
    height: 800px;
    border: 1px solid #ccc;
}
</style>
