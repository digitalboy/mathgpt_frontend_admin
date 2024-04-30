
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
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';
import { ChatService } from '@/services/chatService';
import { GraphData } from '@/services/graphService';
import kpExplainer from '@/assets/prompts/kp_explainer.json';
import { defineProps } from 'vue';

const props = defineProps({
    nodeUuid: {
        type: String,
        default: undefined
    }
});

const graphStore = useGraphStore();
const authStore = useAuthStore();
const neighborhoodVisible = ref(false);
const graphData = ref<GraphData | undefined>();
const aiResponse = ref<string | undefined>();

watchEffect(async () => {
    if (props.nodeUuid) {
        graphData.value = await graphStore.getNeighborhood(props.nodeUuid);
        neighborhoodVisible.value = true;
        console.log(graphStore.currentNode)

        if (graphData.value && authStore.user && graphStore.currentNode) {
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
                    .replace('<graphdata>', JSON.stringify(graphData.value));

                console.log("studentInput", studentInput)
                // 使用generateAIResponse来获取AI的回答
                aiResponse.value = await ChatService.googleAIResponse(prompt.system_instruction, studentInput);
                console.log(aiResponse.value)
            } else {
                aiResponse.value = '此功能仅对学生开放。';
            }
        }
    }
});
</script>