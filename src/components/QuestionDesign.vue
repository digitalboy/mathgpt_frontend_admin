<template>
    <div>
        <GraphNodesRadio />
        <el-row :gutter="20">
            <el-col :span="12">
                <el-input v-model="promptMessage" type="textarea" :rows="20"></el-input>
                <el-button @click="sendQuestion">发送</el-button>
            </el-col>
            <el-col :span="12" v-loading="loading">
                <QuestionCard v-if="aiResponse" :questionData="aiResponse" v-loading="loading" />
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import prompts from '@/assets/prompts/question.json';
import { ChatService } from '@/services/chatService';
import GraphNodesRadio from './GraphNodesRadio.vue';
import QuestionCard from '@/components/QuestionCard.vue';

const graphStore = useGraphStore();
const promptMessage = ref('');
const aiResponse = ref(null);
const loading = ref(false)

// 使用Pinia的store来监视当前节点的变化
watch(() => graphStore.currentNode, (newNode) => {
    if (newNode && newNode.properties.node_name) {
        // 直接使用JSON文件中的提示语，并替换占位符
        promptMessage.value = JSON.stringify(prompts).replace('<user_question>', newNode.properties.node_name);
    } else {
        promptMessage.value = '';  // 清空提示消息如果没有选定的节点
    }
}, { immediate: true });

// 发送问题到AI服务并获取回答
const sendQuestion = async () => {
    loading.value = true
    if (!promptMessage.value.trim()) return;
    const messages = JSON.parse(promptMessage.value);  // 解析字符串为JSON对象
    const response = await ChatService.ask({ messages });    
    if (response && response.response) {
        loading.value = false
        console.log(JSON.parse(response.response))
        aiResponse.value = JSON.parse(response.response);  // 假设 response.response 已经是 QuestionData 类型
    }
};
</script>
