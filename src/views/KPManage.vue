<template>
    <div class="nodes-view">
        <NodeList />
        <KPExplanationEdit :node-uuid="selectedNodeUuid" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import NodeList from '@/components/NodeList.vue';
import KPExplanationEdit from '@/components/KPExplanationEdit.vue';
import { useGraphStore } from '@/stores/graphStore';

const selectedNodeUuid = ref<string>();
const graphStore = useGraphStore();

watch(() => graphStore.currentNode, (newNode) => {
    if (newNode) {
        selectedNodeUuid.value = newNode.properties.uuid;
        console.log(selectedNodeUuid.value)
    }
}, { immediate: true });
</script>

<style scoped>
.nodes-view {
    display: flex;
    flex-direction: column;
    margin: 20px;
}
</style>