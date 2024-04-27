<template>
    <div class="question-cards-container">
        <el-card class="question-card" v-for="(question, index) in questionDetails" :key="index"
            :body-style="{ padding: '20px' }">
            <!-- 显示问题文本 -->
            <div>{{ question.question_text}}</div>
            <!-- 渲染单选按钮组
            <el-radio-group v-model="question.options">
                <el-radio v-for="option in question.options" :value="option.option_id" :key="option.option_id">
                    {{ option.option_text }}
                </el-radio>
            </el-radio-group> -->
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuestionStore } from '@/stores/questionStore';
import { useGraphStore } from '@/stores/graphStore';
import type { QuestionData } from '@/types';

const questionStore = useQuestionStore();
const graphStore = useGraphStore();
const questionDetails = ref < QuestionData[] > ([]);

// Fetch questions based on the UUID from the currentNode
const getQuestionDetails = async () => {
    if (graphStore.currentNode?.properties.uuid) {
        try {
            await questionStore.fetchQuestionByUUID(graphStore.currentNode.properties.uuid);
            if (questionStore.questions) {
                questionDetails.value = questionStore.questions as unknown as QuestionData[]
            }
        } catch (error) {
            console.error('获取题目详细信息失败:', error);
            questionDetails.value = [];
        }
    }
};

watch(() => graphStore.currentNode, () => {
    getQuestionDetails();
}, { immediate: true });
</script>

<style scoped>
/* ...以前的样式... */
</style>