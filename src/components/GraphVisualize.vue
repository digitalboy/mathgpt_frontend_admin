<!-- src/components/GraphVisualize.vue -->
<template>
    <div ref="visContainer" class="vis-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { Network } from 'vis-network/standalone';
import { ElMessage } from 'element-plus';

const visContainer = ref(null);
const graphStore = useGraphStore();

onMounted(async () => {
    // console.log("开始加载图形数据...");
    await graphStore.fetchNodesAndEdges();
    // console.log("加载图形数据完成:", graphStore.nodes, graphStore.edges);
});

watchEffect(() => {
    if (visContainer.value && graphStore.nodes?.length > 0 && graphStore.edges?.length > 0) {
        const graphData = {
            nodes: graphStore.nodes.map(node => ({
                id: node.properties.uuid,  // 使用 uuid 作为唯一标识符
                label: node.properties.node_name,
                title: node.properties.description
            })),
            edges: graphStore.edges.map(edge => ({
                from: edge.start_uuid,  // 确保这些字段匹配节点的 uuid
                to: edge.end_uuid,
                label: edge.type,
                // title: `Since: ${edge.properties.since}`,
                arrows: 'to',
                id: `${edge.start_uuid}-${edge.end_uuid}-${edge.type}`
            }))
        };

        // console.log("graphStore.edges:::",graphStore.edges)
        const options = {
            interaction: { hover: true },
            nodes: {
                shape: 'dot',
                size: 10,                
            },
            edges: {
                smooth: true,
                font:{
                    size:10,
                    color:'#aaaaaa',
                    align:'middle'
                }
            }

        };
        const network = new Network(visContainer.value, graphData, options);
        network.on("click", function (params) {
            handleGraphClick(params);
        });
    } else {
        ElMessage.warning('未加载任何图形数据');
    }
});



function handleGraphClick(params: any) {
    // console.log("点击事件: ", params);
    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        // 确保使用图形中用作ID的同一属性
        const node = graphStore.nodes.find(node => node.properties.uuid === nodeId);
        console.log("查找节点结果：", node);
        if (node) {
            graphStore.setCurrentNode(node);
            console.log('Node clicked:', node);
        } else {
            console.log('未找到节点：', nodeId);
        }
    }
    if (params.edges.length > 0) {
        const edgeId = params.edges[0];
        // 使用同样的 ID 格式来查找边
        const edge = graphStore.edges.find(edge => `${edge.start_uuid}-${edge.end_uuid}-${edge.type}` === edgeId);
        if (edge) {
            graphStore.setCurrentEdge(edge);
            console.log('Edge clicked:', edge);
        } else {
            console.log('未找到边：', edgeId);
        }
    }
}

</script>

<style scoped>
.vis-container {
    width: 100%;
    height: 800px;
    border: 1px solid #e4e4e4;
}
</style>
