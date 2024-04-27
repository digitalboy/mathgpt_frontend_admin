// components/QuestionCards.vue

<template>
    <div class="question-cards-container">
        <el-card class="question-card" v-for="(question, index) in questionDetails" :key="index"
            :body-style="{ padding: '20px' }">
            <div class="content" v-html="formatQuestionContent(question.content)"></div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuestionStore } from '@/stores/questionStore';
import { useGraphStore } from '@/stores/graphStore';

const questionStore = useQuestionStore();
const graphStore = useGraphStore();
const questionDetails = ref([]);

// Fetch questions based on the UUID from the currentNode
const getQuestionDetails = async () => {
    if (graphStore.currentNode?.properties.uuid) {
        try {
            await questionStore.fetchQuestionByUUID(graphStore.currentNode.properties.uuid);
            if (questionStore.questions) {
                questionDetails.value = questionStore.questions;
                console.log("questionDetails::::",questionDetails.value)
            }
        } catch (error) {
            console.error('获取题目详细信息失败:', error);
            questionDetails.value = [];
        }
    }
};

// Formatting Question Content to display the options and question text properly
const formatQuestionContent = (content) => {
    if (!content) return '';
    try {
        const questionObject = JSON.parse(content);
        let formattedContent = `<div><strong>${questionObject.question_text}</strong></div>`;
        if (questionObject.options) {
            formattedContent += '<ul>';
            for (const option of questionObject.options) {
                formattedContent += `<li>${option.option_id}: ${option.option_text}</li>`;
            }
            formattedContent += '</ul>';
        }
        return formattedContent;
    } catch (e) {
        console.error('格式化题目内容时出错:', e);
        return '<div>问题内容无法显示</div>';
    }
};

watch(() => graphStore.currentNode, () => {
    getQuestionDetails();
}, { immediate: true });
</script>

<style scoped>
.question-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.question-card {
    flex: 1;
    min-width: 250px;
}
</style>