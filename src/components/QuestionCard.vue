<!-- src/components/QuestionCard.vue -->
<template>
    <div class="question-card-container">
        <el-card class="question-card">
            <template #header>
                <div>
                    <span>
                        <VueMathjax :formula="latexFormat(questionData.question_text)" />
                    </span>
                </div>
            </template>

            <div v-if="questionData.showResult">
                <el-result :icon="questionData.resultType === 'success' ? 'success' : 'error'"
                    :title="questionData.resultType === 'success' ? '回答正确！' : '回答错误！'" sub-title="请根据提示继续学习或尝试其他问题。">
                    <!-- <template #extra>
                        <el-button @click="handleNextQuestion">下一题</el-button>
                    </template> -->
                </el-result>
            </div>

            <div v-else>
                <el-radio-group v-model="questionData.selectedOption">
                    <el-radio v-for="option in questionData.options" :value="option.option_id" :key="option.option_id">
                        <VueMathjax :formula="latexFormat(option.option_text)" />
                    </el-radio>
                </el-radio-group>
            </div>

            <template #footer v-if="!questionData.showResult">
                <el-button type="primary" @click="submitAnswer(questionData)">提交答案</el-button>
            </template>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useStudentAnswerRecordStore } from '@/stores/studentAnswerRecordStore';
import { useAuthStore } from '@/stores/authStore';
import type { QuestionData } from '@/types';
// import VueMathjax from 'vue-mathjax-next';

const studentAnswerRecordStore = useStudentAnswerRecordStore();
const authStore = useAuthStore();

authStore.initializeAuth();
const studentId = authStore.user?.id || null;

const { questionData } = defineProps<{
    questionData: QuestionData;
}>();


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
            console.log("record:::", record)
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


// 函数来处理题干和选项内容
const latexFormat = (text: string): string => {
    // 去除内容中的$$
    text = text.replace(/\$\$/g, "");
    // 用$$包裹内容
    const formattedText = `$$ ${text} $$`;
    return formattedText;
};

</script>

<style scoped>
.question-card {
    width: 900px;

}

.question-card-container {
    width: 100%;
    height: 20em;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
