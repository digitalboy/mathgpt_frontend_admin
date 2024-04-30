<!-- src/components/GraphVisualize.vue -->
<template>
    <div v-loading="loading">
        <div ref="visContainer" class="vis-container"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';
import { useStudentAnswerRecordStore } from '@/stores/studentAnswerRecordStore';
import { StudentAnswerRecord } from '@/services/studentAnswerRecordService';
import { Network } from 'vis-network/standalone';
// import { ElMessage } from 'element-plus';

const visContainer = ref(null);
const authStore = useAuthStore();
const studentAnswerRecordStore = useStudentAnswerRecordStore();
const graphStore = useGraphStore();
const loading =ref(true)

onMounted(async () => {
    // 正常加载图形数据...
    loading.value = true;
    await graphStore.fetchNodesAndEdges();

    // 如果用户是学生，获取他们的答题记录并更新图形
    if (authStore.user && authStore.user.role === 'student') {
        console.log("authStore.user.role", authStore.user.role)
        await studentAnswerRecordStore.fetchStudentAnswerRecordsByStudent(authStore.user.id);
        // 过滤出错误的答题记录的知识点 UUID
        markNodesByAnswerStatus(studentAnswerRecordStore.studentAnswerRecords);
    }
    // 更新节点数据...
    loading.value = false;
});

watchEffect(() => {
    if (!graphStore.isDataLoading && visContainer.value && graphStore.nodes?.length > 0 && graphStore.edges?.length > 0) {
        const graphData = {
            nodes: graphStore.nodes.map(node => ({
                id: node.properties.uuid,  // 使用 uuid 作为唯一标识符
                label: node.properties.node_name,
                title: node.properties.node_name,
                color: node.color ? node.color : undefined
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
                font: {
                    size: 10,
                    color: '#aaaaaa',
                    align: 'middle'
                }
            }

        };
        const network = new Network(visContainer.value, graphData, options);
        network.on("click", function (params) {
            handleGraphClick(params);
        });
        loading.value = false
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

// 此方法用于标记图中的错误节点
const markNodesByAnswerStatus = (studentAnswerRecords: StudentAnswerRecord[]) => {
    const nodeStatusMap: { [uuid: string]: boolean } = {};
  
    studentAnswerRecords.forEach(record => {
        // 确保 knowlage_point_uuid 不是 undefined，然后再赋值
        if (typeof record.knowlage_point_uuid !== "undefined") {
            nodeStatusMap[record.knowlage_point_uuid] = record.is_fully_correct ?? false; // 使用空值合并操作符作为兜底值
        }
    });

    graphStore.nodes.forEach(node => {
        if (node.properties.uuid in nodeStatusMap) {
            if (nodeStatusMap[node.properties.uuid]) {
                // 如果答题正确，标记为绿色
                node.color = {
                    border: '#21ba45',
                    background: '#a5d6a7'
                };
            } else {
                // 如果答题错误，标记为红色
                node.color = {
                    border: '#ff0000',
                    background: '#ffaaaa'
                };
            }
        }
    });
};

</script>

<style scoped>
.vis-container {
    width: 100%;
    height: 800px;
    border: 1px solid #e4e4e4;
}
</style>
