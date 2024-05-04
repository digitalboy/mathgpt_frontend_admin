<template>
    <div v-loading="isLoadingAIResponse">
        <el-form :model="aiResponse" label-width="120px">
            <el-form-item label="欢迎信息">
                <el-input type="textarea" v-model="safeAIResponse.welcome_message" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="关系">
                <el-input type="textarea" v-model="safeAIResponse.response.relationship" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="定义">
                <el-input type="textarea" v-model="safeAIResponse.response.definition" rows="2"></el-input>
            </el-form-item>
            <!-- 给出流行的定义 -->
            <el-form-item label="通俗的定义">
                <el-input type="textarea" v-model="safeAIResponse.response.popular_definition" rows="2"></el-input>
            </el-form-item>
            <!-- 如果有数学定义，给出数学定义 -->
            <el-form-item label="数学定义" v-if="safeAIResponse.response.math_definition">
                <el-input type="textarea" v-model="safeAIResponse.response.math_definition" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="可能的混淆">
                <el-input type="textarea" v-model="safeAIResponse.response.confusion" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="例子">
                <el-input type="textarea" v-model="safeAIResponse.response.example" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="符号">
                <el-input type="textarea" v-model="safeAIResponse.response.symbols" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="生活化举例">
                <el-input type="textarea" v-model="safeAIResponse.response.popular_example" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="基础数学举例">
                <el-input type="textarea" v-model="safeAIResponse.response.basic_math_example" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="视觉辅助">
                <el-input type="textarea" v-model="safeAIResponse.response.visual_aid" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="现实生活的联系">
                <el-input type="textarea" v-model="safeAIResponse.response.real_life_connection" rows="2"></el-input>
            </el-form-item>
            <!-- 如果有图表，给出图表选项 -->
            <el-form-item label="图表" v-if="safeAIResponse.diagram">
                <el-input type="textarea" v-model="safeAIResponse.diagram" rows="2"></el-input>
            </el-form-item>
            <!-- 如果有结论建议，给出结论建议 -->
            <el-form-item label="结论建议" v-if="safeAIResponse.conclusion_suggestion">
                <el-input type="textarea" v-model="safeAIResponse.conclusion_suggestion" rows="2"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- <div :loading="isLoadingAIResponse">{{ aiResponse }}</div> -->
    <el-button type="primary" @click="handleAIAssist()">获取AI辅助内容</el-button>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps} from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { GraphData } from '@/services/graphService';
import type { KPExplanationContent } from '@/services/KPExplanationService';
import { ChatService } from '@/services/chatService';
import Kp_explainer_groq from '@/assets/prompts/Kp_explainer_groq.json';
import { escapeRegExp } from '@/utils/escapeRegExp'

const props = defineProps({
    nodeUuid: {
        type: String,
        default: undefined
    }
});

const graphStore = useGraphStore();
const aiResponse = ref<KPExplanationContent>();
const isLoadingAIResponse = ref<boolean>(false);
const graphData = ref<GraphData | undefined>();
const neighborhoodVisible = ref(false);

watchEffect(async () => {
    if (props.nodeUuid) {
        aiResponse.value = undefined
        console.log(props.nodeUuid)
        graphData.value = await graphStore.getNeighborhood(props.nodeUuid);
        neighborhoodVisible.value = true;
    }
}
);

const emptyAIResponse: KPExplanationContent = {
    welcome_message: '',
    response: {
        relationship: '',
        definition: '',
        popular_definition: '',
        // 初始化时不包括可选属性
        confusion: '',
        example: '',
        symbols: '',
        popular_example: '',
        visual_aid: '',
        real_life_connection: '',
        basic_math_example: ''
    },
    // 初始化时不包括可选属性
};

const safeAIResponse = ref<KPExplanationContent>(emptyAIResponse);

watchEffect(() => {
    if (aiResponse.value != undefined) {
        safeAIResponse.value = aiResponse.value;
    } else {
        safeAIResponse.value = emptyAIResponse;
    }
});

async function handleAIAssist() {
    if (graphData.value && graphStore.currentNode) {
        isLoadingAIResponse.value = true;
        const knowledgePointName = escapeRegExp(graphStore.currentNode.properties.node_name);
        const promptsClone = JSON.parse(JSON.stringify(Kp_explainer_groq));

        for (const prompt of promptsClone) {
            if (prompt.content.includes('<knowlagepoint>')) {
                prompt.content = prompt.content.replace(/<knowlagepoint>/g, knowledgePointName);
            }
            if (prompt.content.includes('<graphdata>')) {
                const graphDataString = JSON.stringify(graphData.value, null, 2);
                // 确保在替换时不会转义，因为已经预处理了这部分数据
                prompt.content = prompt.content.replace('<graphdata>', graphDataString);
            }
        }

        // 现在，promptsClone包含了已替换占位符的提示内容，准备发送
        const response = await ChatService.grokAIResponse({ messages: promptsClone });        
        isLoadingAIResponse.value = false;
        if (response) {
            aiResponse.value = response.response;
            console.log(aiResponse.value?.welcome_message)
        }
    }
}
</script>