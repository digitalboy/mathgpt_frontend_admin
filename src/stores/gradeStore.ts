// stores/gradeStore.ts
import { defineStore } from 'pinia';
import { Grade, GradeService } from '@/services/gradeService';

export const useGradeStore = defineStore('grade', {
    state: () => ({
        currentGrade: null as Grade | null, // 明确指定类型为 Grade 或 null
    }),
    actions: {
        setCurrentGrade(grade: Grade) {
            console.log('setCurrentGrade', grade);
            this.currentGrade = grade;
        },
        // 添加更新年级信息的方法，便于在组件中调用
        async updateGrade(gradeId: number, gradeData: Grade) {
            try {
                // 假设您有一个 updateGrade 方法在 GradeService 中
                const response = await GradeService.updateGrade(gradeId, gradeData);
                if (response) {
                    console.log('年级信息更新成功！');
                    this.setCurrentGrade(response); // 更新当前年级信息
                    return true;
                }
            } catch (error) {
                console.error('更新年级信息失败：', error);
                return false;
            }
        }
    }
});
