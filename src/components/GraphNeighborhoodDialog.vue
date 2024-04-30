// src/components/NeighborhoodDialog.vue
<template>
    <el-dialog title="邻近节点和边信息" v-model="neighborhoodVisible">
        <div v-if="graphData">
            <div v-for="(value, key) in graphData.nodes" :key="key">
                <strong>节点：</strong>{{ value }}
            </div>
            <div v-for="(value, key) in graphData.edges" :key="key">
                <strong>边：</strong>{{ value }}
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useGraphStore } from '@/stores/graphStore';
import { GraphData } from '@/services/graphService';
import { defineProps } from 'vue';

const props = defineProps({
    nodeUuid: {
        type: String,
        default: undefined
    }
});


const graphStore = useGraphStore();
const neighborhoodVisible = ref(false);
const graphData = ref<GraphData | undefined>();

watchEffect(async () => {
    if (props.nodeUuid) {
        graphData.value = await graphStore.getNeighborhood(props.nodeUuid);
        neighborhoodVisible.value = true;
    }
});
</script>