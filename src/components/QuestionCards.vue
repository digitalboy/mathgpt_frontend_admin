<!-- src/components/QuestionCards.vue -->
<template>
    <div class="question-cards-container">
        <div class="question-counter" v-if="questionDetails.length > 0">
            <span>问题 {{ currentIndex + 1 }} / {{ questionDetails.length }}</span>
        </div>
        <!-- Conditions on v-if ensure only one question is displayed at a time -->
        <question-card v-if="currentQuestion" :question-data="currentQuestion" @nextQuestion="showNextQuestion" />

        <!-- This would be a placeholder or loader in case no question is available -->
        <div v-else class="empty-state">
            <span>请选择一个知识点</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuestionStore } from '@/stores/questionStore';
import { useGraphStore } from '@/stores/graphStore';
import QuestionCard from './QuestionCard.vue';
import type { QuestionData } from '@/types';

const questionStore = useQuestionStore();
const graphStore = useGraphStore();

const currentIndex = ref(0);
const questionDetails = ref<QuestionData[]>([]);

// Computed property to get current question based on the currentIndex
const currentQuestion = computed(() => questionDetails.value[currentIndex.value]);

const getQuestionDetails = async () => {
    if (graphStore.currentNode?.properties.uuid) {
        try {
            await questionStore.fetchQuestionByUUID(graphStore.currentNode.properties.uuid);
            if (questionStore.questions) {
                questionDetails.value = questionStore.questions.map(question => {
                    // 解析每个问题的 content JSON 字符串
                    let parsedQuestion = JSON.parse(question.content);
                    console.log("qid::::", question.id)
                    // 初始化每个问题的选中选项
                    parsedQuestion.id = question.id;
                    parsedQuestion.selectedOption = null;
                    parsedQuestion.showResult = false;
                    parsedQuestion.resultType = '';
                    return parsedQuestion;
                });
            }
        } catch (error) {
            console.error('获取题目详细信息失败:', error);
            questionDetails.value = [];
        }
    }
};

const showNextQuestion = () => {
    if (currentIndex.value < questionDetails.value.length - 1) {
        currentIndex.value++;
    } else {
        // Reset index or show a completion message
        currentIndex.value = 0;
    }
};

watch(() => graphStore.currentNode, () => {
    questionDetails.value = [];
    currentIndex.value = 0;  // Reset index when currentNode changes
    getQuestionDetails();
}, { immediate: true });
</script>