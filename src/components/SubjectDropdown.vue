<!-- src\components\SubjectDropdown.vue -->
<template>
    <div>
        <el-select v-if="subjects.length > 0" v-model="selectedSubjectId" placeholder="请选择学科"
            @change="handleSubjectChange">
            <el-option v-for="subject in subjects" :key="subject.id" :label="subject.name"
                :value="subject.id"></el-option>
        </el-select>
        <div v-else>正在加载数据...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useSubjectStore } from '@/stores/subjectStore';
import { ElMessage } from 'element-plus';

const subjectStore = useSubjectStore();
const selectedSubjectId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const subjects = computed(() => subjectStore.subjects);

// 当选中的学科 ID 变化时，更新当前学科状态
watch(selectedSubjectId, (newId) => {
    if (newId !== null) {
        const subject = subjects.value.find(s => s.id === newId) || null;  // 确保返回类型为 Subject 或 null
        subjectStore.setCurrentSubject(subject);
    } else {
        subjectStore.setCurrentSubject(null);  // 如果 newId 是 null，则显式设置 currentSubject 为 null
    }
});

const handleSubjectChange = (newSubjectId: number | null) => {
    console.log(`Selected Subject ID: ${newSubjectId}`);
};

onMounted(async () => {
    // 确保在组件挂载时加载并刷新学科数据
    try {
        await subjectStore.fetchSubjects();
        if (subjects.value.length > 0) {
            selectedSubjectId.value = subjects.value[0].id ?? null; // 默认选择第一个学科
        }
    } catch (error: any) {
        ElMessage.error('加载学科数据时发生错误: ' + error.message);
    }
});
</script>

<style scoped>
/* 添加适当的样式 */
</style>
