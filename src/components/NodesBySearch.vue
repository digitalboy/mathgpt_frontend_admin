<!-- components/NodesBySearch.vue -->
<template>
    <div>
        <!-- 输入框显示当前学生的年级和科目，不允许编辑 -->
        <el-input v-model="grade" placeholder="年级" disabled></el-input>
        <el-input v-model="subject" placeholder="科目" disabled></el-input>
        <el-radio-group class="radio-group" v-model="selectedNodeId" @change="handleNodeChange">
            <el-radio v-for="node in nodes" :key="node.properties.uuid" :label="node.properties.node_name"
                class="radio-item"/>
                
        </el-radio-group>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';

const graphStore = useGraphStore();
const authStore = useAuthStore();
const selectedNodeId = ref(null);

// 由于用户的认证信息已经在 main.ts 初始化完成，我们可以直接使用它们
onMounted(async () => {
    if (authStore.user && authStore.user.role === 'student') {
        await graphStore.searchNodes(authStore.user.grade_name);
    }
});

// 使用计算属性来访问用户的年级和科目信息
const grade = computed(() => authStore.user?.grade_name ?? '未知年级');
const subject = computed(() => authStore.user?.class_name ?? '未知科目');

// 节点选择变化处理函数
const handleNodeChange = (newNodeId: string | null) => {
    // 在这里处理节点的选择变化
};

// 使用计算属性来获取节点列表
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