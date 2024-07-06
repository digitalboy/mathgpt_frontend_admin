<template>
    <div v-loading="loading">
        <div ref="visContainer" class="vis-container"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { Network } from 'vis-network/standalone';

const visContainer = ref(null);
const graphStore = useGraphStore();
const loading = ref(true);

// 从本地存储中获取关系类型
const getStoredEdgeTypes = () => {
    const storedEdgeTypes = localStorage.getItem('selectedRelationships');
    return storedEdgeTypes ? JSON.parse(storedEdgeTypes) : [];
};

// 从本地存储中获取出版社
const getStoredPublisher = () => {
    const storedPublisher = localStorage.getItem('currentPublisher');
    return storedPublisher ? storedPublisher : '人民教育出版社';
};

const fetchData = async () => {
    const edgeTypes = getStoredEdgeTypes();
    const textbookVersion = getStoredPublisher();
    const subject = '数学'; // 暂时固定为数学

    const storedGrades = localStorage.getItem('currentGradeNames');
    const parsedGrades = JSON.parse(storedGrades || '[]') as string[];
    const formattedGrades = parsedGrades.join(',');

    await graphStore.fetchNodesAndEdges(formattedGrades, subject, undefined, edgeTypes, textbookVersion);
    console.log("guest");

    graphStore.nodes.forEach(node => {
        node.color = { background: 'lightblue', border: 'gray' };
        node.borderWidth = 2;
    });
};

onMounted(async () => {
    await fetchData();
    console.log("onMounted");
    loading.value = false;
});

watchEffect(() => {
    if (!graphStore.isDataLoading && visContainer.value && graphStore.nodes?.length > 0 && graphStore.edges?.length > 0) {
        const graphData = {
            nodes: graphStore.nodes.map(node => {
                const totalQuestions = node.total_questions ?? 0;
                const answeredQuestions = node.answered_questions ?? 0;
                const correctAnswers = node.correct_answers ?? 0;
                const correctRate = answeredQuestions > 0 ? (correctAnswers / answeredQuestions * 100).toFixed(2) : 'N/A';

                let labelContent = node.properties.node_name;
                if (correctRate !== 'N/A') {
                    labelContent = `${node.properties.node_name}\n${correctRate}%`;
                }

                const titleContent = `${node.properties.node_name}
                    
                    总题数: ${totalQuestions}
                    已答题数: ${answeredQuestions}
                    正确题数: ${correctAnswers}
                    正确率: ${correctRate}%
                `;

                return {
                    id: node.properties.uuid,  // 使用 uuid 作为唯一标识符
                    label: labelContent,
                    title: titleContent,
                    color: node.color ? node.color : undefined,
                    borderWidth: node.borderWidth,
                    borderColor: node.color?.border ?? 'defaultBorder',
                    scaling: {
                        min: 10,
                        max: 30,
                    },
                    font: {
                        multi: 'html',
                        size: 12
                    },

                };
            }),
            edges: graphStore.edges.map(edge => ({
                from: edge.start_uuid,  // 确保这些字段匹配节点的 uuid
                to: edge.end_uuid,
                label: edge.type,
                // title: `Since: ${edge.properties.since}`,
                arrows: 'to',
                id: `${edge.start_uuid}-${edge.end_uuid}-${edge.type}`,
                font: {
                    multi: 'html',
                    size: 8
                },
            }))
        };

        // console.log("graphStore.edges:::",graphStore.edges)
        const options = {
            interaction: { hover: true },
            nodes: {
                shape: 'dot',
                size: 10,
                font: {
                    multi: 'html',
                    color: '#343434'
                },
                scaling: {
                    min: 10,
                    max: 30
                }
            },
            edges: {
                smooth: false,
                font: {
                    size: 10,
                    color: '#aaaaaa',
                    align: 'middle'
                }
            },
            layout: {
                improvedLayout: false // 禁用改进的布局算法
            },
        };
        const network = new Network(visContainer.value, graphData, options);
        network.on("click", function (params) {
            handleGraphClick(params);
        });
    } else if (!graphStore.isDataLoading) {
        // ElMessage.warning('未加载任何图形数据');
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
    height: 750px;
    border: 1px solid #e4e4e4;
}
</style>
