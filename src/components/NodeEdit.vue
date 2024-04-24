<template>
    <el-dialog title="编辑节点信息" v-model="editNodeVisible">
        <el-form :model="nodeData.properties" :rules="rules" ref="nodeForm" label-position="right" label-width="auto">
            <el-form-item label="节点ID" prop="uuid">
                <el-input v-model="nodeData.properties.uuid" disabled></el-input>
            </el-form-item>
            <el-form-item label="节点名称" prop="node_name" required>
                <el-input v-model="nodeData.properties.node_name"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description" required>
                <el-input type="textarea" v-model="nodeData.properties.description"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
                <el-input v-model="nodeData.properties.publisher"></el-input>
            </el-form-item>
            <el-form-item label="学科" prop="subject">
                <el-input v-model="nodeData.properties.subject"></el-input>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
                <el-input v-model="nodeData.properties.grade"></el-input>
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
import { useGraphStore } from '@/stores/graphStore';
import { Node } from '@/services/graphService'; // 引入 Node 接口
import { ElMessage, FormInstance } from 'element-plus';

const graphStore = useGraphStore();
const editNodeVisible = ref(false);
const nodeForm = ref<FormInstance | null>(null);
const nodeData = ref<Node>({
    labels: '',
    properties: {
        node_name: '',
        description: '',
        publisher: '',
        subject: '',
        grade: '',
        uuid: ''
    },
});

const rules = {
    node_name: [
        { required: true, message: '请输入节点名称', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入描述', trigger: 'blur' }
    ],
    publisher: [
        { required: true, message: '请输入出版社', trigger: 'blur' }
    ],
    subject: [
        { required: true, message: '请输入学科', trigger: 'blur' }
    ],
    grade: [
        { required: true, message: '请输入年级', trigger: 'blur' }
    ],
    uuid: [
        { required: true, message: 'UUID是必需的', trigger: 'blur' }
    ]
};

watch(() => graphStore.currentNode, (newNode) => {
    if (newNode) {
        nodeData.value = { ...newNode };
        editNodeVisible.value = true;
    }
}, { immediate: true });

watch(editNodeVisible, (newValue) => {
    if (!newValue) {
        graphStore.setCurrentNode(null); // 当对话框关闭时清除当前节点状态
    }
});

const submitForm = () => {
    nodeForm.value?.validate((valid: boolean) => {
        if (valid) {
            const updates = [
                {
                    type: "node",
                    uuid: nodeData.value.properties.uuid,
                    properties: {
                        ...nodeData.value.properties
                    }
                }
            ];
            console.log('更新数据：', updates);
            graphStore.updateNodesAndEdges(updates) // 直接传递 updates 数组
                .then(() => {
                    ElMessage.success('节点信息已更新');
                    editNodeVisible.value = false;
                })
                .catch((error) => {
                    ElMessage.error('更新失败，请重试: ' + error.message);
                });
        } else {
            ElMessage.error('请检查输入的数据');
            return false;
        }
    });
};


const cancel = () => {
    editNodeVisible.value = false;
};
</script>

