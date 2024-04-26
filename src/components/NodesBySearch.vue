<!-- components/NodesBySearch.vue -->
<template>
    <div>
        <!-- 输入框仅用于显示当前学生的年级和科目，不允许编辑 -->
        <el-input v-model="grade" placeholder="年级" disabled></el-input>
        <el-input v-model="subject" placeholder="科目" disabled></el-input>
        <el-radio-group class="radio-group" v-model="selectedNodeId" @change="handleNodeChange">
            <el-radio v-for="node in nodes" :key="node.properties.uuid" :label="node.properties.node_name"
                class="radio-item">
                {{ node.properties.node_name }}
            </el-radio>
        </el-radio-group>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useStudentStore } from '@/stores/studentStore';

const graphStore = useGraphStore();
const studentStore = useStudentStore();

const selectedNodeId = ref('');

// 在组件加载时根据当前登录学生的年级和科目进行搜索
onMounted(async () => {
    console.log(studentStore.currentStudent)
    // 在这进行非空检查
    if (studentStore.currentStudent) {
        console.log(studentStore.currentStudent)
        const { grade_name, class_name } = studentStore.currentStudent;
        if (grade_name && class_name) { // 确保grade_name和class_name都不是undefined
            await graphStore.searchNodes(grade_name, class_name);
        }
    }
});

// 使用计算属性来访问学生的年级和科目信息
const grade = computed(() => studentStore.currentStudent?.grade_name);
const subject = computed(() => studentStore.currentStudent?.class_name);

// 节点选择变化处理函数
const handleNodeChange = (newNodeId: string) => {
    // 处理节点的选择变化
};

// 使用计算属性来获取节点列表，确保它是响应式的
const nodes = computed(() => graphStore.nodes);

</script>

<style scoped>
.radio-group,
.el-input {
    margin-bottom: 10px;
}

.radio-item {
    /* 调整布局，使其更适合你的UI设计 */
}
</style>