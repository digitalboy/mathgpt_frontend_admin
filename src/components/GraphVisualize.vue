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
import { Network } from 'vis-network/standalone';
// import { ElMessage } from 'element-plus';

const visContainer = ref(null);
const authStore = useAuthStore();

const graphStore = useGraphStore();
const loading =ref(true)

onMounted(async () => {
    if (authStore.user && authStore.user.role === 'student') {
        const studentId = authStore.user.id;
        const grade = authStore.user.grade_name;
        const subject = '数学'; // 暂时固定为数学

        await graphStore.fetchNodesAndEdges(grade, subject, studentId);

        graphStore.nodes.forEach(node => {
            const totalQuestions = node.total_questions ?? 0;
            const answeredQuestions = node.answered_questions ?? 0;
            const correctAnswers = node.correct_answers ?? 0;

            const coverageRate = totalQuestions > 0 ? answeredQuestions / totalQuestions : 0;
            const correctRate = answeredQuestions > 0 ? correctAnswers / answeredQuestions : 0;

            // 设置背景色
            let backgroundColor, borderColor, borderWidth;
            if (correctRate === 1) {
                backgroundColor = '#00b050'; // 鲜绿色
            } else if (correctRate >= 0.75) {
                backgroundColor = '#92d050'; // 浅绿色
            } else if (correctRate >= 0.50) {
                backgroundColor = '#ffff00'; // 黄色
            } else if (correctRate >= 0.25) {
                backgroundColor = '#ff9900'; // 橙色
            } else if (correctRate > 0) {
                backgroundColor = '#ff0000'; // 红色
            } else {
                backgroundColor = '#a6a6a6'; // 灰色
            }

            // 设置边框颜色和宽度
            borderColor = darkenColor(backgroundColor, 8); // 边框颜色加深20%
            if (coverageRate >= 0.80) {
                borderWidth = 8;
            } else if (coverageRate >= 0.50) {
                borderWidth = 6;
            } else if (coverageRate >= 0.20) {
                borderWidth = 4;
            } else {
                borderWidth = 1;
            }

            node.color = {
                background: backgroundColor,
                border: borderColor
            };
            node.borderWidth = borderWidth; // 设置节点的边框宽度
        });

    } else {
        const storedGrade = localStorage.getItem('currentGradeName');
        const subject = '数学';
        await graphStore.fetchNodesAndEdges(storedGrade as string, subject);
        graphStore.nodes.forEach(node => {
            node.color = { background: 'lightblue', border: 'gray' };
            node.borderWidth = 2;
        });
    }
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

function darkenColor(rgbColor: string, amount: number): string {
    // 将 hex 转换为 RGB
    let [r, g, b] = rgbColor.match(/\w\w/g)!.map(x => parseInt(x, 16));
    // 转换 RGB 为 HSL
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / d + 2;
        } else if (max === b) {
            h = (r - g) / d + 4;
        }
        h /= 6;
    }

    // 降低亮度
    l -= amount / 100;
    s = s * 100;  // 将饱和度转换为百分比
    h = h * 360;  // 将色相转换为角度

    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l * 100)}%)`;
}

</script>

<style scoped>
.vis-container {
    width: 100%;
    height: 800px;
    border: 1px solid #e4e4e4;
}
</style>
