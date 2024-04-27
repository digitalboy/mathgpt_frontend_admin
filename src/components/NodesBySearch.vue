<!-- components/NodesBySearch.vue -->
<template>
    <div>
        <!-- 输入框显示当前学生的年级和科目，不允许编辑 -->
        
        <el-radio-group class="radio-group" v-model="selectedNodeId" @change="handleNodeChange">

            <el-radio v-for="node in nodes" :key="node.properties.uuid" :value="node.properties.uuid"
                class="radio-item">{{ node.properties.node_name }}</el-radio>

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

// 由于用户的认证信息已经在 main.ts 
onMounted(async () => {
    if (authStore.user && authStore.user.role === 'student') {
        await graphStore.searchNodes(authStore.user.grade_name);
    }
});

// 节点选择变化处理函数
const handleNodeChange = (newNodeId: string | null) => {
    const selectedNode = graphStore.nodes.find(node => node.properties.uuid === newNodeId);
    graphStore.setCurrentNode(selectedNode || null);
    console.log(selectedNode)
};

// 使用计算属性来获取节点列表
const nodes = computed(() => graphStore.nodes);
</script>

<style scoped>
.radio-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.radio-item {
    margin-right: 10px;
    /* 添加一些右边距 */
    min-width: 70px;
    /* 设定一个最小宽度 */
    width: 150px;
    /* 设定具体宽度 */
    white-space: nowrap;
    /* 防止文本换行 */
    overflow: hidden;
    /* 隐藏溢出部分 */
    text-overflow: ellipsis;
    /* 使用省略号表示被截断的文本 */
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}
</style>