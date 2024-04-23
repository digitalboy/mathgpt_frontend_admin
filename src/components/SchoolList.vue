<!-- // components/SchoolList.vue -->
<template>
    <el-table :data="schools" >
        <el-table-column prop="name" label="学校名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="location" label="位置"></el-table-column>
        <el-table-column prop="contact" label="联系方式"></el-table-column>
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="primary" :icon="Edit" circle @click="editSchool(row)" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { onMounted,computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useSchoolStore } from '@/stores/schoolStore'; // 导入学校的状态管理
import { School } from '@/services/schoolService';
import { Edit } from '@element-plus/icons-vue';

const schoolStore = useSchoolStore(); // 使用学校的状态存储
const schools = computed(() => schoolStore.schools); // 使用计算属性来响应状态变化

const editSchool = (school: School) => {
    schoolStore.setCurrentSchool(school);
    console.log('当前编辑的学校已保存：', school);
    // 你可能需要路由到一个编辑页面或打开一个模态框进行具体的编辑操作
};

onMounted(() => {
    if (schools.value.length === 0) {
        schoolStore.fetchSchools().catch(error => {
            ElMessage.error('加载学校数据失败: ' + error.message);
        });
    }
});
</script>

<style scoped></style>
