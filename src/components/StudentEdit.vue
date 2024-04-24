<!-- src/components/StudentEdit.vue -->
<template>
    <el-dialog title="编辑学生信息" v-model="editStudentVisible">
        <el-form :model="student" :rules="rules" ref="studentForm" label-position="right" label-width="auto">
            <el-form-item label="学生ID" prop="id">
                <el-input v-model="student.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="学生名称" prop="name" required>
                <el-input v-model="student.name"></el-input>
            </el-form-item>
            <el-form-item label="班级" prop="class_id" required>
                <ClassDropdown style="width: 100%;" />
            </el-form-item>
            <el-form-item label="电话号码" prop="phone_number">
                <el-input v-model="student.phone_number"></el-input>
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
import { useStudentStore } from '@/stores/studentStore';
import { useClassStore } from '@/stores/classStore'; // 导入班级状态
import { Student } from '@/services/studentService';
import { ElMessage, FormInstance } from 'element-plus';
import ClassDropdown from './ClassDropdown.vue';

const studentStore = useStudentStore();
const classStore = useClassStore(); // 使用班级状态
const editStudentVisible = ref(false);
const studentForm = ref<FormInstance | null>(null);
const student = ref<Student>({
    id: 0,
    name: '',
    class_id: 0,
    phone_number: ''
});

// 当对话框显示时加载班级数据
watch(editStudentVisible, async (visible) => {
    if (visible && classStore.classes.length === 0) {
        await classStore.fetchClasses();
    }
});

const rules = {
    name: [
        { required: true, message: '请输入学生名称', trigger: 'blur' }
    ],
    phone_number: [
        { required: true, message: '请输入电话号码', trigger: 'blur' }
    ],
    class_id: [
        { required: true, message: '请选择班级', trigger: 'change' }
    ]
};

// 监视学生状态的变化
watch(() => studentStore.currentStudent, (newStudent) => {
    if (newStudent) {
        student.value = { ...newStudent };
        editStudentVisible.value = true;
    }
}, { immediate: true });

// 监视对话框的可见性
watch(editStudentVisible, (newValue) => {
    if (!newValue) {
        studentStore.setCurrentStudent(null); // 当对话框关闭时清除当前学生状态
    }
});

const submitForm = () => {
    
    studentForm.value?.validate((valid: boolean) => {
        if (valid) {
            console.log(student.value)
            // 检查 id 是否已定义且为数字
            if (typeof student.value.id === 'number') {
                studentStore.updateStudent(student.value.id, student.value)
                    .then(() => {
                        ElMessage.success('学生信息已更新');
                        editStudentVisible.value = false;
                    })
                    .catch((error) => {
                        ElMessage.error('更新失败，请重试: ' + error.message);
                    });
            } else {
                ElMessage.error('无有效的学生ID，请检查数据');
            }
        } else {
            ElMessage.error('请检查输入的数据');
            return false;
        }
    });
};

const cancel = () => {
    editStudentVisible.value = false;
};
</script>

<style scoped></style>
