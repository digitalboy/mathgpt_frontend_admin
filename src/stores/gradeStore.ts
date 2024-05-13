// stores/gradeStore.ts
import { defineStore } from 'pinia';
import { Grade, GradeService } from '@/services/gradeService';

export const useGradeStore = defineStore('grade', {
    state: () => ({
        grades: [] as Grade[],
        currentGrade: null as Grade | null,
    }),
    actions: {
        setCurrentGrade(grade: Grade | null) {
            this.currentGrade = grade;
            localStorage.setItem('currentGradeId', grade ? grade.id!.toString() : '');
            localStorage.setItem('currentGradeName', grade ? grade.name!.toString() : '');
        },
        async fetchGrades() {
            try {
                const grades = await GradeService.getGrades();
                if (grades) {
                    this.grades = grades;
                    console.log(this.grades);
                    const storedGradeId = localStorage.getItem('currentGradeId');
                    if (storedGradeId) {
                        const gradeId = parseInt(storedGradeId);
                        const storedGrade = this.grades.find(g => g.id === gradeId);
                        // 在尝试设置当前年级之前，检查 storedGrade 是否存在
                        if (storedGrade) {
                            this.setCurrentGrade(storedGrade);
                        } else {
                            this.setCurrentGrade(null); // 如果找不到对应的年级，显示为 null
                        }
                    }
                }
            } catch (error) {
                console.error('加载年级列表失败:', error);
            }
        },
        async fetchGradeById(gradeId: number) {
            try {
                const grade = await GradeService.getGradeById(gradeId);
                if (grade) {
                    this.setCurrentGrade(grade);
                }
            } catch (error) {
                console.error('获取年级详细信息失败:', error);
            }
        },
        async createGrade(gradeData: Grade) {
            try {
                const newGrade = await GradeService.createGrade(gradeData);
                if (newGrade) {
                    this.grades.push(newGrade);
                    this.setCurrentGrade(newGrade);
                }
            } catch (error) {
                console.error('创建年级失败:', error);
            }
        },
        async updateGrade(gradeId: number, gradeData: Grade) {
            try {
                const updatedGrade = await GradeService.updateGrade(gradeId, gradeData);
                if (updatedGrade) {
                    const index = this.grades.findIndex(g => g.id === gradeId);
                    if (index !== -1) {
                        this.grades[index] = updatedGrade;
                        this.setCurrentGrade(updatedGrade);
                    }
                }
            } catch (error) {
                console.error('更新年级信息失败:', error);
            }
        },
        async deleteGrade(gradeId: number) {
            try {
                await GradeService.deleteGrade(gradeId);
                this.grades = this.grades.filter(g => g.id !== gradeId);
                if (this.currentGrade?.id === gradeId) {
                    this.currentGrade = null;
                }
            } catch (error) {
                console.error('删除年级失败:', error);
            }
        }
    }
});
