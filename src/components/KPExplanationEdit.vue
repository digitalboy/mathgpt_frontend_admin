<template>
    <el-dialog title="编辑知识点解释" v-model="editKPExplanationVisible">
        <div v-loading="isLoadingAIResponse">
            <el-form :model="safeAIResponse" label-width="120px">

                <el-form-item label="欢迎信息">
                    <el-input type="textarea" v-model="safeAIResponse.welcome_message" rows="2"></el-input>
                </el-form-item>

                <el-form-item label="关系">
                    <el-input type="textarea" v-model="safeAIResponse.response.relationship" rows="2"></el-input>
                </el-form-item>

                <el-form-item label="定义">
                    <el-input type="textarea" v-model="safeAIResponse.response.definition" rows="2"></el-input>
                </el-form-item>
                
                <el-form-item label="通俗的定义">
                    <el-input type="textarea" v-model="safeAIResponse.response.popular_definition" rows="2"></el-input>
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
                    <el-input type="textarea" v-model="safeAIResponse.response.real_life_connection"
                        rows="2"></el-input>
                </el-form-item>
                
                <!-- <el-form-item label="图表" v-if="safeAIResponse.diagram">
                    <el-input type="textarea" v-model="safeAIResponse.diagram" rows="2"></el-input>
                </el-form-item> -->
                
                <el-form-item label="结论建议" v-if="safeAIResponse.conclusion_suggestion">
                    <el-input type="textarea" v-model="safeAIResponse.conclusion_suggestion" rows="2"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveExplanation">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div :loading=" isLoadingAIResponse">{{ aiResponse }}
        </div> -->
        <el-button type="primary" @click="handleAIAssist()">获取AI辅助内容</el-button>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps, watch } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { GraphData } from '@/services/graphService';
import type { KPExplanation, KPExplanationContent } from '@/services/KPExplanationService';
import { ChatService } from '@/services/chatService';
import Kp_explainer_groq from '@/assets/prompts/Kp_explainer_groq.json';
import { escapeRegExp } from '@/utils/escapeRegExp'
import { ElMessage } from 'element-plus'
import { useKPExplanationStore } from '@/stores/KPExplanationStore';
import { findSubjectId, findGradeId } from '@/utils/lookupHelpers'

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
const editKPExplanationVisible = ref(false);
const kpExplanationStore = useKPExplanationStore();

watchEffect(async () => {
    if (props.nodeUuid) {
        aiResponse.value = undefined
        console.log(props.nodeUuid)
        graphData.value = await graphStore.getNeighborhood(props.nodeUuid);
        neighborhoodVisible.value = true;
        editKPExplanationVisible.value = true;
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
        math_definition: '', // 确保这里设置了初始值
        confusion: '',
        example: '',
        symbols: '',
        popular_example: '',
        visual_aid: '',
        real_life_connection: '',
        basic_math_example: ''
    },
    // 初始化时不包括可选属性
    diagram: '', // 确保这里设置了初始值
    conclusion_suggestion: '', // 确保这里设置了初始值
};

const safeAIResponse = ref<KPExplanationContent>(emptyAIResponse);

watch(() => kpExplanationStore.currentExplanation, (newExplanation) => {
    if (newExplanation) {
        if (typeof aiResponse.value === 'string') {
            // 如果是字符串，尝试将它解析成对象
            safeAIResponse.value = JSON.parse(aiResponse.value);
        } else {
            // 如果已经是对象，直接用它来设置 safeAIResponse
            safeAIResponse.value = aiResponse.value as KPExplanationContent;
        }
    } else {
        safeAIResponse.value = {
            welcome_message: '',
            response: {
                relationship: '',
                definition: '',
                popular_definition: '',
                confusion: '', example: '',
                symbols: '',
                popular_example: '',
                visual_aid: '',
                real_life_connection: '',
                basic_math_example: ''
            }, diagram: '',
            conclusion_suggestion: '',
        };
    }
}, { immediate: true });


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

        try {
            // 尝试获取AI辅助内容
            const response = await ChatService.grokAIResponse({ messages: promptsClone });
            if (response) {
                aiResponse.value = response.response;
                kpExplanationStore.currentExplanation = {
                    knowledge_point_uuid: props.nodeUuid as string,
                    grade_id: 1,
                    subject_id: 3,
                    content: aiResponse.value as KPExplanationContent,
                    // 其他需要的属性
                };
                console.log(aiResponse.value)
                console.log(kpExplanationStore.currentExplanation)

            }
        } catch (error) {
            console.error('获取AI辅助内容失败:', error);
            ElMessage.error('获取AI辅助内容失败，请稍后再试');
        }
        isLoadingAIResponse.value = false;
    }
}

// 定义保存函数
async function saveExplanation() {
    if (graphStore.currentNode) {
        const subjectId = await findSubjectId(graphStore.currentNode.properties.subject);
        const gradeId = await findGradeId(graphStore.currentNode.properties.grade);

        if (subjectId === undefined || gradeId === undefined) {
            console.error('无法获取年级ID或科目ID');
            ElMessage.error('无法保存解释：无效的年级或科目ID');
            return;
        }

        try {
            const explanationData = {
                knowledge_point_uuid: props.nodeUuid,
                content: safeAIResponse.value,
                grade_id: gradeId,
                subject_id: subjectId,
            };
            // await kpExplanationStore.createExplanation(explanationData as KPExplanation);
            const savedExplanation = await kpExplanationStore.createExplanation(explanationData as KPExplanation);
            if (savedExplanation) {
                kpExplanationStore.explanations.push(savedExplanation);
                editKPExplanationVisible.value = false;
                ElMessage.success('知识点解释已保存');
            }
        } catch (error) {
            console.error('保存知识点解释失败:', error);
            ElMessage.error('保存失败，请重试');
        }
    }
}
</script>