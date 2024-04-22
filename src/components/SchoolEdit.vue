<!-- src\components\SchoolEdit.vue -->
<template>
    <el-dialog title="编辑学校信息" v-model="visible">
        <el-form :model="school" :rules="rules" ref="schoolForm">
            <el-form-item label="学校ID" prop="id">
                <el-input v-model="school.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="学校名称" prop="name" required>
                <el-input v-model="school.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="school.description"></el-input>
            </el-form-item>
            <el-form-item label="位置" prop="location" required>
                <el-input v-model="school.location"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact" required>
                <el-input v-model="school.contact"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSchoolStore } from '@/stores/schoolStore';
import { School } from '@/services/schoolService'; // 引入 School 接口
import { ElMessage, FormInstance } from 'element-plus';

const schoolStore = useSchoolStore();
const visible = ref(false);
const schoolForm = ref<FormInstance | null>(null);
// 初始化 school，所有属性为空字符串，临时处理ID为空字符串问题
const school = ref<School>({
    id: 0, // 初始化时可以使用 0 或空字符串，根据后端需求
    name: '',
    description: '',
    location: '',
    contact: ''
});

const rules = {
    name: [
        { required: true, message: '请输入学校名称', trigger: 'blur' }
    ],
    location: [
        { required: true, message: '请输入学校位置', trigger: 'blur' }
    ],
    contact: [
        { required: true, message: '请输入联系方式', trigger: 'blur' }
    ]
};

// 监视学校状态的变化
watch(() => schoolStore.currentSchool, (newSchool) => {
    if (newSchool) {
        school.value = { ...newSchool };
        visible.value = true;
    }
}, { immediate: true });

const submitForm = () => {
    schoolForm.value?.validate((valid: boolean) => {
        if (valid) {
            if (typeof school.value.id === 'number') { // 确保 id 存在且为数字
                console.log('更新数据：', school.value);
                schoolStore.updateSchool(school.value.id, school.value).then(response => {
                    if (response) {
                        ElMessage.success('学校信息已更新');
                        visible.value = false;
                    } else {
                        ElMessage.error('更新失败，请重试');
                    }
                });
            } else {
                ElMessage.error('无有效的学校ID，请检查数据');
            }
        } else {
            ElMessage.error('请检查输入的数据');
            return false;
        }
    });
};


const cancel = () => {
    visible.value = false;
};
</script>

