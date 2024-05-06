<!-- components/KPExplainer.vue -->
<template>
    <div class="kp-explainer">
        <el-dialog v-model="dialogVisible" :title="explanationTitle">
            <div class="content" v-html="explanationContent"></div>
            <template #footer>
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref,watchEffect} from 'vue';
import { defineProps } from 'vue';
import type { KPExplanationContent } from '@/services/KPExplanationService'
import { useKPExplanationStore } from '@/stores/KPExplanationStore';

const props = defineProps({
    nodeUuid: {
        type: String,
        default: ''
    }
});
const kpExplanationStore = useKPExplanationStore();
const dialogVisible = ref(false);
const explanationTitle = ref('');
const explanationContent = ref<KPExplanationContent>();

// 当传入的nodeUuid发生变化时，获取相应的知识点解释
watchEffect(() => {
    if (props.nodeUuid) {
        console.log(props.nodeUuid)
        dialogVisible.value = true;
        kpExplanationStore.fetchExplanationsByUUID(props.nodeUuid)
            .then(() => {
                const explanation = kpExplanationStore.explanations?.[0];
                if (explanation) {
                    
                    explanationTitle.value = '知识点解释';
                    explanationContent.value = explanation.content;
                }
            })
            .catch(() => {
                dialogVisible.value = false;
            });
    }
});
</script>

<style scoped>

</style>