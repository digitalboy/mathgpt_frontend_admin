<!-- src\components\QuestionCard.vue -->
<template>
    <el-form :model="editableData" @submit.prevent="handleSubmit" label-width="auto" label-position="right">
        <el-form-item label="题干">
            <el-input v-model="editableData.question_text" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="布鲁姆目标">
            <el-input v-model="editableData.bloom_taxonomy_level"></el-input>
        </el-form-item>
        <el-form-item v-for="(option, _index) in editableData.options" :key="option.option_id"
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
import { useGraphStore } from '@/stores/graphStore';
import { findSubjectId, findGradeId, findTextbookVersionId } from '@/utils/lookupHelpers';
import { useQuestionStore } from '@/stores/questionStore';
import type { QuestionData } from '@/types';

const props = defineProps<{ questionData: QuestionData }>();
const editableData = ref<QuestionData>(JSON.parse(JSON.stringify(props.questionData)));

watch(() => props.questionData, (newValue) => {
    // 当检测到新的 questionData 时，重置 editableData
    editableData.value = JSON.parse(JSON.stringify(newValue));
}, { deep: true, immediate: true });

const handleSubmit = async () => {
    console.log('提交的数据:', editableData.value);
    const graphStore = useGraphStore();
    const questionStore = useQuestionStore();
    const currentNode = graphStore.currentNodeDetails;

    if (currentNode) {
        const subjectId = await findSubjectId(currentNode.properties.subject);
        const textbookVersionId = await findTextbookVersionId(currentNode.properties.publisher);
        const gradeId = await findGradeId(currentNode.properties.grade);

        if (subjectId === undefined || textbookVersionId === undefined || gradeId === undefined) {
            console.error('无法提交：科目、教材版本或年级ID未找到。');
            return;
        }

        const completeData = {
            question_type: editableData.value.question_type,
            bloom_taxonomy_level: editableData.value.bloom_taxonomy_level,
            content: JSON.stringify(editableData.value),  // 将整个题目JSON字符串化
            knowledge_point_uuid: currentNode.properties.uuid,
            subject_id: subjectId,
            textbook_version_id: textbookVersionId,
            grade_id: gradeId,
            description: editableData.value.explanation
        };

        try {
            await questionStore.createQuestion(completeData);
            resetFormData();
            console.log('题目创建成功！');
        } catch (error) {
            console.error('题目创建失败:', error);
        }
    } else {
        console.error('当前没有选择任何知识点');
    }
};

function resetFormData() {
    // 重置 editableData 为初始状态或默认模板
    editableData.value = {
        question_type:'',
        question_text: '',
        bloom_taxonomy_level: '',
        options: [],
        correct_answer: [],
        explanation: '',
        difficulty_level: ''
        // 确保其他所有必要字段都被适当重置
    };
}
</script>
