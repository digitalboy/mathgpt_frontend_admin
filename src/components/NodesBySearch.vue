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
import { ref, onMounted, computed, watchEffect, defineProps } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';
import { useStudentAnswerRecordStore } from '@/stores/studentAnswerRecordStore';
import { StudentAnswerRecord } from '@/services/studentAnswerRecordService';

// 定义新的prop以指示想要显示的节点类型：'all', 'correct', 'wrong', 'uninvolved'
const props = defineProps({
    displayType: {
        type: String,
        default: 'all' // 默认显示全部
    }
});

const graphStore = useGraphStore();
const authStore = useAuthStore();
const studentAnswerRecordStore = useStudentAnswerRecordStore();
const selectedNodeId = ref(null);

// 根据答题记录调整节点颜色的逻辑
const markNodesByAnswerStatus = (studentAnswerRecords: StudentAnswerRecord[]) => {
    const nodeStatusMap: { [uuid: string]: boolean } = {};

    studentAnswerRecords.forEach(record => {
        if (typeof record.knowlage_point_uuid !== 'undefined') {
            nodeStatusMap[record.knowlage_point_uuid] = record.is_fully_correct ?? false;
        }
    });

    graphStore.nodes.forEach(node => {
        if (nodeStatusMap[node.properties.uuid]) {
            // 如果答题正确，标记为绿色
            node.color = {
                border: '#21ba45',
                background: '#a5d6a7'
            };
        } else if (nodeStatusMap.hasOwnProperty(node.properties.uuid)) {
            // 如果答题错误，标记为红色
            node.color = {
                border: '#ff0000',
                background: '#ffaaaa'
            };
        } else {
            // 如果没有记录，不改变颜色
            node.color = undefined;
        }
    });
};

// 获取答题记录和知识点，然后刷新颜色
onMounted(async () => {
    if (authStore.user && authStore.user.role === 'student') {
        await graphStore.searchNodes(authStore.user.grade_name);
        await studentAnswerRecordStore.fetchStudentAnswerRecordsByStudent(authStore.user.id);
        markNodesByAnswerStatus(studentAnswerRecordStore.studentAnswerRecords);
    }
});

watchEffect(() => {
    if (studentAnswerRecordStore.studentAnswerRecords) {
        markNodesByAnswerStatus(studentAnswerRecordStore.studentAnswerRecords);
    }
});



// 节点选择变化处理函数
const handleNodeChange = (newNodeId: string | null) => {
    const selectedNode = graphStore.nodes.find(node => node.properties.uuid === newNodeId);
    graphStore.setCurrentNode(selectedNode || null);
};

// 使用计算属性来获取并动态更新带有颜色的节点列表
// 使用计算属性来筛选节点，基于displayType的值
const nodes = computed(() => {
    switch (props.displayType) {
        case 'correct':
            // 只显示正确的知识点
            return graphStore.nodes.filter(node => node.color && node.color.background === '#a5d6a7');
        case 'wrong':
            // 只显示错误的知识点
            return graphStore.nodes.filter(node => node.color && node.color.background === '#ffaaaa');
        case 'uninvolved':
            // 只显示未涉及的知识点
            return graphStore.nodes.filter(node => !node.color);
        case 'all':
        default:
            // 显示所有知识点
            return graphStore.nodes;
    }
});

const getNodeClass = (node:any) => {
    if (node.color) {
        if (node.color.background === '#a5d6a7') {
            return 'node-correct'; // 正确答题的节点样式类
        } else if (node.color.background === '#ffaaaa') {
            return 'node-wrong'; // 错误答题的节点样式类
        }
    }
    return ''; // 无状态节点不添加样式类
};
</script>

<style scoped>
.radio-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.radio-item {
    margin-right: 10px;
    min-width: 70px;
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 注意：此处选择更加具体的元素并使用了!important来应用样式 */
.el-radio.node-wrong {
    color: #ff0000;
    /* font-weight: bold; */
    /* background-color: #ffaaaa !important; */
    border-color: #ff0000 !important;
}

.el-radio.node-correct {
    color: #21ba45;
    /* background-color: #a5d6a7 !important; */
    border-color: #21ba45 !important;
}
</style>