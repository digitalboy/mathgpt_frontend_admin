<!-- src/components/RelationshipSelect.vue -->
<template>
    <el-form-item prop="selectedRelationships">
        <el-select v-model="selectedRelationships" multiple placeholder="请选择关系" style="width: 100%;">
            <el-option v-for="relation in relationships" :key="relation.type" :label="relation.type"
                :value="relation.type">
                <template #default="{  }">
                    <span>{{ relation.type }} - {{ relation.description }}</span>
                </template>
            </el-option>
        </el-select>
    </el-form-item>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const relationships = ref([
    {
        type: "Prerequisite",
        direction: "directed",
        description: "描述一个概念是理解另一个概念的先决条件。",
        example: { from: "加法", to: "乘法" }
    },
    {
        type: "Includes",
        direction: "directed",
        description: "表明一个概念是另一个更广泛概念的一部分。",
        example: { from: "三角形", to: "几何图形" }
    },
    {
        type: "RelatedTo",
        direction: "undirected",
        description: "表示两个概念之间的相关性或关联性。",
        example: { from: "概率", to: "统计" }
    },
    {
        type: "AppliedIn",
        direction: "directed",
        description: "指一个概念如何在另一个领域或实例中被应用。",
        example: { from: "几何学", to: "建筑设计" }
    },
    {
        type: "AdvancesTo",
        direction: "directed",
        description: "表明一个概念是另一个概念的深入或拓展。",
        example: { from: "基础代数", to: "高等代数" }
    },
    {
        type: "ContrastsWith",
        direction: "undirected",
        description: "描述两个概念之间的对比或差异。",
        example: { from: "离散数学", to: "连续数学" }
    },
    {
        type: "SynonymousWith",
        direction: "undirected",
        description: "用于连接意思相近或相同的不同表述的概念。",
        example: { from: "减法", to: "差运算" }
    },
    {
        type: "HistoricallyDevelopedFrom",
        direction: "directed",
        description: "反映了概念的历史发展或演变。",
        example: { from: "古典代数", to: "现代代数" }
    },
    {
        type: "SubsetOf",
        direction: "directed",
        description: "表示一个概念是另一个概念的子集。",
        example: { from: "有理数", to: "实数" }
    },
    {
        type: "SpecialCaseOf",
        direction: "directed",
        description: "表示一个概念是另一个更一般概念的特殊情况。",
        example: { from: "正方形", to: "矩形" }
    },
    {
        type: "AnalogousTo",
        direction: "undirected",
        description: "表示两个概念在不同情境下具有类似的结构或性质。",
        example: { from: "平面几何", to: "立体几何" }
    },
    {
        type: "ComplementaryTo",
        direction: "undirected",
        description: "表示两个概念在一定程度上互为补充。",
        example: { from: "微分", to: "积分" }
    }
]);

const selectedRelationships = ref<string[]>([]);

// 从本地存储加载已选择的关系
onMounted(() => {
    const storedRelationships = localStorage.getItem('selectedRelationships');
    if (storedRelationships) {
        selectedRelationships.value = JSON.parse(storedRelationships);
    }
});

// 监听选中的关系变化，并保存到本地存储
watch(selectedRelationships, (newVal) => {
    localStorage.setItem('selectedRelationships', JSON.stringify(newVal));
});
</script>

<style scoped>
.el-select {
    width: 100%;
}
</style>
