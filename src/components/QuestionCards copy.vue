<template>
    <div class="question-cards-container">
        <el-card class="question-card" v-for="(question, index) in questionDetails" :key="index">
            <template #header>
                <div>
                    <span>
                        {{ question.question_text }}
                    </span>
                </div>
            </template>
            <div v-if="question.showResult">
                <el-result :icon="question.resultType === 'success' ? 'success' : 'error'"
                    :title="question.resultType === 'success' ? '回答正确！' : '回答错误！'" sub-title="请根据提示继续学习或尝试其他问题。">
                    <template #extra>
                        <el-button type="primary">某个功能</el-button>
                    </template>
                </el-result>
                <el-card><el-text  type="success">{{ question.explanation }}</el-text></el-card>

            </div>
            <div v-else>
                <el-radio-group v-model="question.selectedOption">
                    <el-radio v-for="option in question.options" :value="option.option_id" :key="option.option_id">
                        {{ option.option_text }}
                    </el-radio>
                </el-radio-group>
            </div>
            <template #footer v-if="!question.showResult">
                <el-button type="primary" @click="submitAnswer(question)">提交答案</el-button>
            </template>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuestionStore } from '@/stores/questionStore';
import { useGraphStore } from '@/stores/graphStore';
import { useAuthStore } from '@/stores/authStore';
import { useStudentAnswerRecordStore } from '@/stores/studentAnswerRecordStore';

import type { QuestionData } from '@/types';


const authStore = useAuthStore();
const questionStore = useQuestionStore();
const graphStore = useGraphStore();
const studentAnswerRecordStore = useStudentAnswerRecordStore();

const questionDetails = ref<QuestionData[]>([]);

authStore.initializeAuth();
const studentId = authStore.user?.id || null;

const showResult = ref(false);
// const resultType = ref('');

// Fetch questions based on the UUID from the currentNode
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
const submitAnswer = async (question: QuestionData) => {
    if (studentId && question.selectedOption) {
        try {
            // 创建答案记录对象
            const record = {
                student_id: studentId,
                question_id: question.id as number,
                student_answer: question.selectedOption,
                // 添加其他必需的记录字段
            };
            console.log(record)
                      // 检查答案是否正确
            const isCorrect = question.correct_answer.includes(question.selectedOption);

            // 根据是否正确更新每个问题对象自身的状态
            question.showResult = true; // 标记为展示结果
            question.resultType = isCorrect ? 'success' : 'error'; // 设置结果类型

            await studentAnswerRecordStore.createStudentAnswerRecord(record);
            // 处理答案提交成功的情况，如更新UI或通知用户
        } catch (error) {
            // 处理错误的情况
            console.error('提交答案失败:', error);
        }
    } else {
        // 处理未选择答案的情况
        console.error('未选择答案或未登录学生');
    }
};

watch(() => graphStore.currentNode, () => {
    questionDetails.value = [];
    getQuestionDetails();
    showResult.value=false
}, { immediate: true });
</script>

<style scoped>
/* ...以前的样式... */
</style>