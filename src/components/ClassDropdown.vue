<!-- src\components\ClassDropdown.vue -->
<template>
    <div>
        <el-select v-if="classes.length > 0" v-model="selectedClassId" placeholder="请选择班级" @change="handleClassChange">
            <el-option v-for="classInfo in classes" :key="classInfo.id" :label="classInfo.name"
                :value="classInfo.id"></el-option>
        </el-select>
        <div v-else>正在加载数据...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useClassStore } from '@/stores/classStore';
import { ElMessage } from 'element-plus';

const classStore = useClassStore();
const selectedClassId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const classes = computed(() => classStore.classes);

// 当选中的班级 ID 变化时，更新当前班级状态
watch(selectedClassId, (newId, _oldId) => {
    // console.log('Selected Class ID changed from', oldId, 'to', newId);
    if (newId !== null) {
        const classInfo = classes.value.find(c => c.id === newId) || null;
        // console.log('Found class info:', classInfo);
        classStore.setCurrentClass(classInfo);
    } else {
        classStore.setCurrentClass(null);
    }
});


const handleClassChange = (newClassId: number | null) => {
    console.log(`Selected Class ID: ${newClassId}`);
};

onMounted(async () => {
    // 确保在组件挂载时加载并刷新班级数据
    try {
        await classStore.fetchClasses();
        if (classes.value.length > 0) {
            selectedClassId.value = classes.value[0].id ?? null; // 默认选择第一个班级
        }
    } catch (error: any) {
        ElMessage.error('加载班级数据时发生错误: ' + error.message);
    }
});
</script>

<style scoped>
/* 添加适当的样式 */
</style>
