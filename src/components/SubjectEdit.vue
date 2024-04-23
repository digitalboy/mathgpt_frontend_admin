<!-- src/components/SubjectEdit.vue -->
<template>
    <el-dialog title="编辑学科信息" v-model="editSubjectVisible">
        <el-form :model="subject" :rules="rules" ref="subjectForm">
            <el-form-item label="学科ID" prop="id">
                <el-input v-model="subject.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="学科名称" prop="name" required>
                <el-input v-model="subject.name"></el-input>
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
import { useSubjectStore } from '@/stores/subjectStore';
import { Subject } from '@/services/subjectService'; // 引入 Subject 接口
import { ElMessage, FormInstance } from 'element-plus';

const subjectStore = useSubjectStore();
const editSubjectVisible = ref(false);
const subjectForm = ref<FormInstance | null>(null);
const subject = ref<Subject>({
    id: 0,
    name: ''
});

const rules = {
    name: [
        { required: true, message: '请输入学科名称', trigger: 'blur' }
    ]
};

// 监视学科状态的变化
watch(() => subjectStore.currentSubject, (newSubject) => {
    if (newSubject) {
        subject.value = { ...newSubject };
        editSubjectVisible.value = true;
    }
}, { immediate: true });

// 监视对话框的可见性
watch(editSubjectVisible, (newValue) => {
    if (!newValue) {
        subjectStore.setCurrentSubject(null); // 当对话框关闭时清除当前学科状态
    }
});

const submitForm = () => {
    subjectForm.value?.validate((valid: boolean) => {
        if (valid) {
            // 确保 id 是已定义的并且是一个数字
            if (subject.value.id !== undefined && typeof subject.value.id === 'number') {
                console.log('更新数据：', subject.value);
                subjectStore.updateSubject(subject.value.id, subject.value)
                    .then(() => {
                        ElMessage.success('学科信息已更新');
                        editSubjectVisible.value = false;
                    })
                    .catch((error) => {
                        ElMessage.error('更新失败，请重试: ' + error.message);
                    });
            } else {
                ElMessage.error('无有效的学科ID，请检查数据');
            }
        } else {
            ElMessage.error('请检查输入的数据');
            return false;
        }
    });
};


const cancel = () => {
    editSubjectVisible.value = false;
};
</script>

<style scoped></style>
