<!-- components/QuestionDetailsTable.vue -->
<template>
    <div>
        <el-table :data="questionDetails" style="width: 100%">
            <el-table-column prop="id" label="题目ID" width="80"></el-table-column>
            <el-table-column prop="knowledge_point_uuid" label="UUID" width="240"></el-table-column>
            <el-table-column prop="content" label="题目内容"></el-table-column>           
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref, watch} from 'vue';
import { useQuestionStore } from '@/stores/questionStore';
import { useGraphStore } from '@/stores/graphStore';
import type { QuestionData } from '@/types';

const questionStore = useQuestionStore();
const graphStore = useGraphStore();
// const props = defineProps<{ questionData: QuestionData }>();
const questionDetails = ref<QuestionData[]>([]);

const getQuestionDetails = async () => {
    // console.log(graphStore.currentNode?.properties.uuid)
    if (graphStore.currentNode?.properties.uuid) {
        try {
            // Assumes fetchQuestionById action sets the detail in the store's state
            await questionStore.fetchQuestionByUUID(graphStore.currentNode.properties.uuid);
            // console.log(questionStore.questions)
            if (questionStore.questions) {
                questionDetails.value = questionStore.questions as unknown as QuestionData[];
            }
        } catch (error) {
            console.error('获取题目详细信息失败:', error);
            questionDetails.value = [];
        }
    } else {
        questionDetails.value = [];
    }
};

watch(() => graphStore.currentNode, getQuestionDetails, { immediate: true });


</script>

<style scoped>
/* Add styles if needed */
</style>