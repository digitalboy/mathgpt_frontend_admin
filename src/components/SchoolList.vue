<!-- // components/SchoolList.vue -->
<template>
    <el-table :data="schools" style="width: 100%">
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { SchoolService } from '@/services/schoolService';
import { useSchoolStore } from '@/stores/schoolStore'; // 导入学校的状态管理
import { School } from '@/services/schoolService';
import { Edit, } from '@element-plus/icons-vue';


const schoolStore = useSchoolStore(); // 使用学校的状态存储
const schools = ref<School[]>([]); // 明确指定 schools 的类型为 School[]

const fetchSchools = async () => {
    try {
        const data = await SchoolService.getSchools();
        if (data) {
            schools.value = data;
        } else {
            throw new Error('未能获取学校数据');
        }
    } catch (error) {
        if (error instanceof Error) {
            ElMessage.error('加载学校数据失败: ' + error.message);
        } else {
            ElMessage.error('发生未知错误');
        }
    }
};

const editSchool = (school: School) => { 
    schoolStore.setCurrentSchool(school); 
    console.log('当前编辑的学校已保存：', school);
    // 你可能需要路由到一个编辑页面或打开一个模态框进行具体的编辑操作
};

onMounted(() => {
    fetchSchools();
});
</script>

<style scoped></style>
