<template>
    <el-dialog title="请粘贴到AI" v-model="neighborhoodVisible">
        <el-input v-model="studentInput" type="textarea" :rows="15" placeholder="请输入内容...">
        </el-input>
        <template #footer>
            <div class="dialog-footer">
                <el-button  @click="copyToClipboard(studentInput)">拷贝</el-button>

            </div>
        </template>

    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';
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
const studentInput =ref("")


watchEffect(async () => {
    if (props.nodeUuid) {
        graphData.value = await graphStore.getNeighborhood(props.nodeUuid);
        neighborhoodVisible.value = true;

        if (graphData.value && authStore.user && graphStore.currentNode) {
            const prompt = kpExplainer[0];
            const userRole = authStore.user.role;
            const userName = authStore.user.name || '<studentname>';
            const userGrade = authStore.user.grade_name || '<grade>';
            const knowledgePointName = graphStore.currentNode.properties.node_name;

            if (userRole === 'student') {
                // 准备简化的图形数据，排除description
                const simplifiedGraphData = JSON.stringify({
                    nodes: graphData.value.nodes.map(node => ({
                        labels: node.labels,
                        properties: {
                            grade: node.properties.grade,
                            node_name: node.properties.node_name,
                            publisher: node.properties.publisher,
                            subject: node.properties.subject,
                            uuid: node.properties.uuid
                        },
                        elementId: node.elementId,
                        color: node.color
                    })),
                    edges: graphData.value.edges
                });

                // 替换模板中的占位符
                studentInput.value = prompt.user_input
                    .replace('<grade>', userGrade)
                    .replace(/<studentname>/g, userName)
                    .replace(/<knowlagepoint>/g, knowledgePointName)
                    .replace('<graphdata>', simplifiedGraphData);

                console.log(studentInput.value)

                // 获取AI的回答
                // aiResponse.value = await ChatService.googleAIResponse(prompt.system_instruction, studentInput);
            } 
        }
    }
});

// 新增拷贝功能的函数
function copyToClipboard(text: string) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            // 可以在此处添加拷贝成功后的反馈，如弹出提示信息
            console.log("内容已拷贝到剪贴板");
        }).catch(err => {
            console.error('拷贝到剪贴板失败:', err);
        });
    } else {
        console.error('浏览器不支持剪贴板操作');
    }
}
</script>