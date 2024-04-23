<!-- src/components/ClassEdit.vue -->
<template>
    <el-dialog title="编辑班级信息" v-model="editClassVisible">
        <el-form :model="classInfo" :rules="rules" ref="classForm">
            <el-form-item label="班级ID" prop="id">
                <el-input v-model="classInfo.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="班级名称" prop="name" required>
                <el-input v-model="classInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="年级ID" prop="grade_id" required>
                <el-input v-model="classInfo.grade_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="年级名称" prop="grade_name" required>
                <el-input v-model="classInfo.grade_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="班级人数" prop="num_of_students" required>
                <el-input v-model="classInfo.num_of_students"></el-input>
            </el-form-item>
            <el-form-item label="班级介绍" prop="description" required>
                <el-input v-model="classInfo.description"></el-input>
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
import { useClassStore } from '@/stores/classStore';
import { Class } from '@/services/classService'; // 引入 Class 接口
import { ElMessage, FormInstance } from 'element-plus';

const classStore = useClassStore();
const editClassVisible = ref(false);
const classForm = ref<FormInstance | null>(null);
const classInfo = ref<Class>({
    id: 0,
    name: '',
    grade_id: 0,
    num_of_students: 0,
    description: ''
});

// 更新规则，确保属性名称与绑定到输入字段的模型属性名称一致
const rules = {
    name: [
        { required: true, message: '请输入班级名称', trigger: 'blur' }
    ],
    num_of_students: [
        { required: true, message: '请输入班级人数', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入班级介绍', trigger: 'blur' }
    ]
};

// 监视班级状态的变化
watch(() => classStore.currentClass, (newClass) => {
    if (newClass) {
        classInfo.value = { ...newClass };
        editClassVisible.value = true;
    }
}, { immediate: true });

// 监视对话框的可见性
watch(editClassVisible, (newValue) => {
    if (!newValue) {
        classStore.setCurrentClass(null); // 当对话框关闭时清除当前班级状态
    }
});

const submitForm = () => {
    classForm.value?.validate((valid: boolean) => {
        if (valid) {
            if (typeof classInfo.value.id === 'number' && typeof classInfo.value.grade_id === 'number') {
                console.log('更新数据：', classInfo.value);
                classStore.updateClass(classInfo.value.id, classInfo.value)
                    .then(() => {
                        ElMessage.success('班级信息已更新');
                        editClassVisible.value = false;
                    })
                    .catch((error) => {
                        ElMessage.error('更新失败，请重试: ' + error.message);
                    });
            } else {
                ElMessage.error('无有效的班级ID或年级ID，请检查数据');
            }
        } else {
            ElMessage.error('请检查输入的数据');
            return false;
        }
    });
};

const cancel = () => {
    editClassVisible.value = false;
};
</script>

