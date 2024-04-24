<!-- src\components\TextbookVersionDropdown.vue -->
<template>
    <div>
        <el-select v-if="textbookVersions.length > 0" v-model="selectedTextbookVersionId" placeholder="请选择教材版本"
            @change="handleTextbookVersionChange">
            <el-option v-for="tv in textbookVersions" :key="tv.id" :label="`${tv.publisher} ${tv.publish_year}`"
                :value="tv.id"></el-option>
        </el-select>
        <div v-else>正在加载数据...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTextbookVersionStore } from '@/stores/textbookVersionStore';
import { ElMessage } from 'element-plus';

const textbookVersionStore = useTextbookVersionStore();
const selectedTextbookVersionId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const textbookVersions = computed(() => textbookVersionStore.textbookVersions);

// 当选中的教材版本 ID 变化时，更新当前教材版本状态
watch(selectedTextbookVersionId, (newId) => {
    if (newId !== null) {
        const tv = textbookVersions.value.find(tv => tv.id === newId) || null;  // 确保返回类型为 TextbookVersion 或 null
        textbookVersionStore.setCurrentTextbookVersion(tv);
    } else {
        textbookVersionStore.setCurrentTextbookVersion(null);  // 如果 newId 是 null，则显式设置 currentTextbookVersion 为 null
    }
});

const handleTextbookVersionChange = (newTextbookVersionId: number | null) => {
    console.log(`Selected Textbook Version ID: ${newTextbookVersionId}`);
};

onMounted(async () => {
    // 确保在组件挂载时加载并刷新教材版本数据
    try {
        await textbookVersionStore.fetchTextbookVersions();
        if (textbookVersions.value.length > 0) {
            selectedTextbookVersionId.value = textbookVersions.value[0].id ?? null; // 默认选择第一个教材版本
        }
    } catch (error: any) {
        ElMessage.error('加载教材版本数据时发生错误: ' + error.message);
    }
});
</script>

<style scoped>
/* 添加适当的样式 */
</style>
