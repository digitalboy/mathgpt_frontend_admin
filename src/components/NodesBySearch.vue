<!-- components/NodesBySearch.vue -->
<template>
    <div>
        <el-radio-group class="radio-group" v-model="selectedNodeId" @change="handleNodeChange">
            <el-radio v-for="node in nodes" :key="node.properties.uuid" :value="node.properties.uuid"
                :class="getNodeClass(node)">{{ node.properties.node_name }}</el-radio>
        </el-radio-group>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect, defineProps, watch } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';

// 定义新的 prop 以指示想要显示的节点类型：'all', 'correct', 'wrong', 'uninvolved'
const props = defineProps({
    displayType: {
        type: String,
        default: 'all' // 默认显示全部
    }
});

const graphStore = useGraphStore();
const authStore = useAuthStore();
const selectedNodeId = ref(null);

// 根据答题记录调整节点颜色的逻辑
const markNodesByAnswerStatus = () => {
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
        borderColor = darkenColor(backgroundColor, 8);
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
        node.borderWidth = borderWidth;
    });
};

// 获取答题记录和知识点，然后刷新颜色
onMounted(async () => {
    if (authStore.user && authStore.user.role === 'student') {
        const studentId = authStore.user.id;
        const grade = authStore.user.grade_name;
        const subject = '数学';

        await graphStore.fetchNodesAndEdges(grade, subject, studentId);
        markNodesByAnswerStatus();
    }
});

watchEffect(() => {
    if (!graphStore.isDataLoading) {
        markNodesByAnswerStatus();
    }
});

watch(() => props.displayType, (_newValue, _oldValue) => {
    // 当 displayType 变化时，清空当前选择的节点
    graphStore.setCurrentNode(null);
});

// 节点选择变化处理函数
const handleNodeChange = (newNodeId: string | null) => {
    const selectedNode = graphStore.nodes.find(node => node.properties.uuid === newNodeId);
    graphStore.setCurrentNode(selectedNode || null);
};

// 使用计算属性来筛选节点，基于 displayType 的值
const nodes = computed(() => {
    switch (props.displayType) {
        case 'correct':
            return graphStore.nodes.filter(node => {
                const answeredQuestions = node.answered_questions ?? 0;
                const correctAnswers = node.correct_answers ?? 0;
                const correctRate = answeredQuestions > 0 ? correctAnswers / answeredQuestions : 0;
                return correctRate >= 0.75;
            });
        case 'wrong':
            return graphStore.nodes.filter(node => {
                const answeredQuestions = node.answered_questions ?? 0;
                const correctAnswers = node.correct_answers ?? 0;
                const correctRate = answeredQuestions > 0 ? correctAnswers / answeredQuestions : 0;
                return correctRate < 0.75 && answeredQuestions > 0;
            });
        case 'uninvolved':
            return graphStore.nodes.filter(node => {
                const answeredQuestions = node.answered_questions ?? 0;
                return answeredQuestions === 0;
            });
        case 'all':
        default:
            return graphStore.nodes;
    }
});

const getNodeClass = (node: any) => {
    const colorMap: Record<string, string> = {
        '#00b050': 'node-perfect',   // 完全正确
        '#92d050': 'node-correct',   // 大部分正确
        '#ffff00': 'node-partial',   // 部分正确
        '#ff9900': 'node-warning',   // 警告
        '#ff0000': 'node-wrong',     // 错误
        '#a6a6a6': 'node-uninvolved' // 未涉及
    };

    return colorMap[node.color?.background] ?? '';
};

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
    s = s * 100; // 将饱和度转换为百分比
    h = h * 360; // 将色相转换为角度

    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l * 100)}%)`;
}
</script>

<style scoped>
.radio-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.el-radio {
    margin-right: 10px;
    min-width: 70px;
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

/* 完全正确的节点 */
.el-radio.node-perfect {
    color: #00b050;
    border-color: #00b050 !important;
    /* text-shadow: 1px 1   px 2px rgb(0, 0, 0); */
}

/* 大部分正确的节点 */
.el-radio.node-correct {
    color: #92d050;
    border-color: #92d050 !important;
    /* text-shadow: 1px 1px 2px rgb(0, 0, 0); */
}

/* 部分正确的节点 */
.el-radio.node-partial {
    color: #cccc06;
    border-color: #ffff00 !important;
    /* text-shadow: 1px 1px 2px rgb(0, 0, 0); */
}

/* 警告节点 */
.el-radio.node-warning {
    color: #ff9900;
    border-color: #ff9900 !important;
    text-shadow: 1px 1px 2px rgb(0, 0, 0);
}

/* 错误的节点 */
.el-radio.node-wrong {
    color: #ff0000;
    border-color: #ff0000 !important;
    /* text-shadow: 1px 1px 2px rgb(0, 0, 0); */
}

/* 未涉及的节点 */
.el-radio.node-uninvolved {
    color: #555454;
    border-color: #a6a6a6 !important;
}
</style>
