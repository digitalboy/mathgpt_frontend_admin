<!-- src\components\GradeEdit.vue -->
<template>
    <el-dialog title="编辑年级信息" v-model="editGradeVisible">
        <el-form :model="grade" :rules="rules" ref="gradeForm">
            <el-form-item label="年级ID" prop="id">
                <el-input v-model="grade.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="年级名称" prop="name" required>
                <el-input v-model="grade.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="grade.description"></el-input>
            </el-form-item>
            <el-form-item label="所属学校ID" prop="school_id" required>
                <el-input v-model="grade.school_id"></el-input>
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
import { useGradeStore } from '@/stores/gradeStore';
import { Grade } from '@/services/gradeService'; // 引入 Grade 接口
import { ElMessage, FormInstance } from 'element-plus';

const gradeStore = useGradeStore();
const editGradeVisible = ref(false);
const gradeForm = ref<FormInstance | null>(null);
const grade = ref<Grade>({
    id: 0,
    name: '',
    description: '',  // 确保包含 description
    school_id: 0      // 确保包含 school_id
});

const rules = {
    name: [
        { required: true, message: '请输入年级名称', trigger: 'blur' }
    ],
    school_id: [
        { required: true, message: '请输入所属学校ID', trigger: 'blur' }
    ]
};

// 监视年级状态的变化
watch(() => gradeStore.currentGrade, (newGrade) => {
    if (newGrade) {
        grade.value = { ...newGrade };
        editGradeVisible.value = true;
    }
}, { immediate: true });

// 监视对话框的可见性
watch(editGradeVisible, (newValue) => {
    if (!newValue) {
        gradeStore.setCurrentGrade(null); // 当对话框关闭时清除当前年级状态
    }
});

const submitForm = () => {
    gradeForm.value?.validate((valid: boolean) => {
        if (valid) {
            if (typeof grade.value.id === 'number' && typeof grade.value.school_id === 'number') {
                console.log('更新数据：', grade.value);
                gradeStore.updateGrade(grade.value.id, grade.value)
                    .then(() => {
                        ElMessage.success('年级信息已更新');
                        editGradeVisible.value = false;
                    })
                    .catch((error) => {
                        ElMessage.error('更新失败，请重试: ' + error.message);
                    });
            } else {
                ElMessage.error('无有效的年级ID或学校ID，请检查数据');
            }
        } else {
            ElMessage.error('请检查输入的数据');
            return false;
        }
    });
};


const cancel = () => {
    editGradeVisible.value = false;
};
</script>
