<template>
    <el-form :model="editableData" @submit.prevent="handleSubmit" label-width="auto" label-position="right">
        <el-form-item label="题干">
            <el-input v-model="editableData.question_text" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item v-for="(option, index) in editableData.options" :key="option.option_id"
            :label="`选项 ${option.option_id}`">
            <el-input v-model="option.option_text"></el-input>
        </el-form-item>
        <el-form-item label="正确答案">
            <el-radio-group v-model="editableData.correct_answer[0]">
                <el-radio v-for="option in editableData.options" :label="option.option_id" :key="option.option_id">
                    {{ option.option_id }}
                </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="解析">
            <el-input v-model="editableData.explanation" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="难度级别">
            <el-radio-group v-model="editableData.difficulty_level">
                <el-radio label="easy">易</el-radio>
                <el-radio label="medium">中</el-radio>
                <el-radio label="hard">难</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" native-type="submit">提交</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { QuestionData } from '@/types';

const props = defineProps<{ questionData: QuestionData }>();
const editableData = ref<QuestionData>(JSON.parse(JSON.stringify(props.questionData)));

watch(() => props.questionData, (newValue) => {
    // 当检测到新的 questionData 时，重置 editableData
    editableData.value = JSON.parse(JSON.stringify(newValue));
}, { deep: true, immediate: true });

const handleSubmit = () => {
    console.log('提交的数据:', editableData.value);
    // 这里可以添加提交逻辑，例如API调用等
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
