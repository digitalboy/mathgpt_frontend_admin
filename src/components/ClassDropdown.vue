<!-- src/components/ClassDropdown.vue -->
<template>
    <el-select v-model="selectedClassId" placeholder="请选择班级" @change="handleClassChange">
        <el-option v-for="classItem in classes" :key="classItem.id" :label="classItem.name" :value="classItem.id">
        </el-option>
    </el-select>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { useClassStore } from '@/stores/classStore';
import { ElMessage } from 'element-plus';

const classStore = useClassStore();
const selectedClassId = ref<number | null>(null);

// 使用Pinia状态管理获取classes数组
const classes = ref(classStore.classes);

// 传递班级ID而非对象
const handleClassChange = (newClassId: number) => {
    selectedClassId.value = newClassId; // 只更新班级ID
};

onMounted(() => {
    if (classStore.classes.length === 0) {
        classStore.fetchClasses().catch(error => {
            ElMessage.error('加载班级数据时发生错误: ' + error.message);
        });
    }
});

// watch(() => selectedClassId.value, (newId) => {
//     // 可能需要调用外部方法或触发事件
// });
</script>
