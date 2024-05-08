<!-- components/KPExplainer.vue -->
<template>
    <div class="kp-explainer">
        <el-dialog v-model="dialogVisible" :title="explanationTitle" width="80%" destroy-on-close>
            <div :style="{ width: '100%', height: canvasHeight + 'px' }">
                <VueFlow v-model="flowElements" :default-viewport="{ zoom: 1 }" :max-zoom="4" :min-zoom="0.2"
                     class="my-diagram-class">
                    <Background bgColor="#409eff" />
                </VueFlow>
            </div>
            <!-- <el-divider /> -->
            <!-- <div class="content" v-html="explanationContent"></div> -->
            <template #footer>
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { KPExplanationContent } from '@/services/KPExplanationService'
import type { Node as GNode } from '@/services/graphService'
import { useKPExplanationStore } from '@/stores/KPExplanationStore';
import { useGraphStore } from '@/stores/graphStore';
import type { Elements } from '@vue-flow/core';

import { VueFlow, Position } from '@vue-flow/core';
import { Background } from '@vue-flow/background'

const props = defineProps({
    nodeUuid: {
        type: String,
        default: ''
    }
});
const kpExplanationStore = useKPExplanationStore();
const graphStore = useGraphStore();
const dialogVisible = ref(false);
const explanationTitle = ref('');
const explanationContent = ref<KPExplanationContent>();
const canvasHeight = ref(600);

const flowElements = ref<Elements>([]);


const generateFlowElementsFromJSON = (rootNode: GNode, content: KPExplanationContent, canvasHeight: number) => {
    const elements: Elements = [];
    const width = 800; // 两侧节点的水平间距
    const initialY = canvasHeight;
    const stepY = 100; // 节点之间的垂直间距

    // 添加根节点，放置在左侧，垂直居中
    elements.push({
        id: rootNode.properties.uuid,
        type: 'default',
        position: { x: 200, y: initialY*2 },
        data: { label: `${rootNode.properties.node_name}` },
        sourcePosition: Position.Right,
        targetPosition: Position.Right
    });

    let yPosition = initialY; // 初始y位置为根节点的y位置

    if (content.response) {
        const keys = Object.keys(content.response);
        keys.forEach((key, _index) => {
            const value = (content.response as any)[key]; // 访问值
            const nodeId = `node-${key}`;

            // 其他节点放置在右侧
            elements.push({
                id: nodeId,
                type: 'default',
                position: { x: rootNode.properties.uuid.length + width, y: yPosition },
                data: { label: `${value}` },
                targetPosition: Position.Left,
                sourcePosition: Position.Left,
                width: "auto",
                style:{color:"darkblue",textAlign:'left'}
            });

            // 连接根节点和当前生成的节点
            elements.push({
                id: `edge-${rootNode.properties.uuid}-${nodeId}`,
                source: rootNode.properties.uuid,
                target: nodeId,
                label: key, // 在边上显示键名
                animated: true,
                style: { stroke: 'blue', strokeWidth: 3 },
                
            });

            yPosition += stepY; // 每个节点之间增加100px的间距
        });
    }

    return elements;
};

// 当传入的nodeUuid发生变化时，获取相应的知识点解释
watchEffect(() => {
    if (props.nodeUuid) {
        dialogVisible.value = true;
        kpExplanationStore.fetchExplanationsByUUID(props.nodeUuid)
            .then(() => {
                const explanation = kpExplanationStore.explanations?.[0];
                if (explanation && typeof explanation.content === 'string') {
                    // 尝试解析 JSON 字符串
                    try {
                        const contentObj = JSON.parse(explanation.content);
                        explanationTitle.value = '知识点解释';
                        explanationContent.value = contentObj;
                        flowElements.value = generateFlowElementsFromJSON(graphStore.currentNode as GNode, contentObj as KPExplanationContent, canvasHeight.value);
                    } catch (error) {
                        console.error('Error parsing explanation content:', error);
                        dialogVisible.value = false;
                    }
                }
            })
            .catch(() => {
                dialogVisible.value = false;
            });
    }
});



</script>

<style scoped>
.my-diagram-class:hover {
    /* --vf-node-bg: #ff0000 */
}
</style>