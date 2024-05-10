<!-- src/components/QuestionCards.vue -->
<template>
    <div style="width: 100%;">
        <el-row v-if="questionDetails.length > 0">
            <el-col :span="24">
                <div>
                    <!-- <span>问题 {{ currentIndex + 1 }} / {{ questionDetails.length }}</span> -->
                </div>
            </el-col>
        </el-row>

        <el-row v-if="currentQuestion">
            <el-col :span="24">
                <question-card :question-data="currentQuestion"  />
            </el-col>
        </el-row>

        <el-row v-if="questionDetails.length > 0">
            <el-col :span="24">
                <el-pagination @current-change="handlePageChange" :current-page.sync="currentPage" :page-size="pageSize"
                    :total="questionDetails.length" background layout="prev, pager, next">
                </el-pagination>
            </el-col>
        </el-row>

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

const currentPage = ref(1); // Current page index
const pageSize = 1; // Number of questions per page
const questionDetails = ref<QuestionData[]>([]);

// Computed property to get current question based on the currentIndex
const currentQuestion = computed(() => questionDetails.value[(currentPage.value - 1) * pageSize]);

const getQuestionDetails = async () => {
    if (graphStore.currentNode?.properties.uuid) {
        try {
            await questionStore.fetchQuestionByUUID(graphStore.currentNode.properties.uuid);
            if (questionStore.questions) {
                questionDetails.value = questionStore.questions.map(question => {
                    // 解析每个问题的 content JSON 字符串
                    const parsedQuestion = JSON.parse(question.content as any);
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


// Handle page change event
const handlePageChange = (page: number) => {
    currentPage.value = page;
};

watch(() => graphStore.currentNode, () => {
    questionDetails.value = [];
    currentPage.value = 1;  // Reset current page index when currentNode changes
    getQuestionDetails();
}, { immediate: true });
</script>
