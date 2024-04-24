<!-- src\components\GradeDropdown.vue -->
<template>
    <div>
        <el-select v-if="grades.length > 0" v-model="selectedGradeId" placeholder="请选择年级" @change="handleGradeChange">
            <el-option v-for="grade in grades" :key="grade.id" :label="grade.name" :value="grade.id"></el-option>
        </el-select>
        <div v-else><el-text class="mx-1" type="warning">正在加载数据...</el-text></div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGradeStore } from '@/stores/gradeStore';
import { ElMessage } from 'element-plus';

const gradeStore = useGradeStore();
const selectedGradeId = ref<number | null>(null);

// 使用计算属性确保响应式更新
const grades = computed(() => gradeStore.grades);

// 当选中的年级 ID 变化时，更新当前年级状态
watch(selectedGradeId, (newId) => {
  if (newId !== null) {
    const grade = grades.value.find(g => g.id === newId) || null;  // 确保返回类型为 Grade 或 null
    gradeStore.setCurrentGrade(grade);
  } else {
    gradeStore.setCurrentGrade(null);  // 如果 newId 是 null，则显式设置 currentGrade 为 null
  }
});


const handleGradeChange = (newGradeId: number | null) => {
  console.log(`Selected Grade ID: ${newGradeId}`);
};

onMounted(async () => {
  // 确保在组件挂载时加载并刷新年级数据
  try {
    await gradeStore.fetchGrades();
    if (grades.value.length > 0) {
      selectedGradeId.value = grades.value[0].id ?? null; // 默认选择第一个年级
    }
  } catch (error: any) {
    ElMessage.error('加载年级数据时发生错误: ' + error.message);
  }
});
</script>

<style scoped>
/* 添加适当的样式 */
</style>