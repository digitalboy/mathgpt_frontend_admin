// src/components/NeighborhoodDialog.vue
<template>
    <el-dialog title="邻近节点和边信息" v-model="neighborhoodVisible">
        <div v-if="graphData">
            <div v-for="(value, key) in graphData.nodes" :key="key">
                <strong>节点：</strong>{{ value }}
            </div>
            <div v-for="(value, key) in graphData.edges" :key="key">
                <strong>边：</strong>{{ value }}
            </div>
        </div>
        <div v-if="aiResponse">
            <p>AI回答：</p>
            <p>{{ aiResponse }}</p>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';
import { GraphData } from '@/services/graphService';
import { ChatService } from '@/services/chatService';
import kpExplainer from '@/assets/prompts/kp_explainer.json';

const aiResponse = ref<string | undefined>();

const graphStore = useGraphStore();
const authStore = useAuthStore();
const neighborhoodVisible = ref(false);
const graphData = ref<GraphData | undefined>();

watch(() => graphStore.currentNode, async (newNode, oldNode) => {
    // 只有当新旧节点确实不同且新节点存在时，才继续执行
    if (newNode && (!oldNode || newNode.properties.uuid !== oldNode.properties.uuid)) {
        console.log("当前节点从:", oldNode?.properties.node_name, "变更为:", newNode?.properties.node_name);
        graphData.value = await graphStore.getNeighborhood(newNode.properties.uuid);
        await nextTick();
        neighborhoodVisible.value = true;
    }
}, { immediate: true, deep: true });

// 当我们的邻近节点数据发生变化时调用AI服务生成回答
watch(graphData, async (newGraphData) => {
    if (newGraphData && authStore.user && graphStore.currentNode) {
        // 准备交互信息
        const prompt = kpExplainer[0];
        const userRole = authStore.user.role;
        const userName = authStore.user.name || '<studentname>';
        const userGrade = authStore.user.grade_name || '<grade>';
        const knowledgePointName = graphStore.currentNode.properties.node_name; // 当前节点的名称

        // 检查用户是否为学生，并替换占位符
        if (userRole === 'student') {
            const user_inputTemplate = prompt.user_input;
            const studentInput = user_inputTemplate
                .replace('<grade>', userGrade)
                .replace(/<studentname>/g, userName)
                .replace(/<knowlagepoint>/g, knowledgePointName)
                .replace('<graphdata>', JSON.stringify(newGraphData));

            // console.log("studentInput", studentInput)
            // 使用generateAIResponse来获取AI的回答
            // aiResponse.value = await ChatService.googleAIResponse(prompt.system_instruction, studentInput);
        } else {
            aiResponse.value = '此功能仅对学生开放。';
        }
    }
});

watch(neighborhoodVisible, (newValue) => {
    console.log("close")
    if (!newValue) {
        graphStore.setCurrentNode(null); // 当对话框关闭时清除当前节点状态
    }
});

</script>