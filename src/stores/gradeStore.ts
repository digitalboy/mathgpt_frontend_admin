// stores/gradeStore.ts
import { defineStore } from 'pinia';
import { Grade, GradeService } from '@/services/gradeService';

export const useGradeStore = defineStore('grade', {
    state: () => ({
        grades: [] as Grade[],
        currentGrades: [] as Grade[],
        currentGradeNames: [] as string[],
    }),
    actions: {
        setCurrentGrades(grades: Grade[]) {
            this.currentGrades = grades;
            localStorage.setItem('currentGradeIds', JSON.stringify(grades.map(grade => grade.id)));            
        },
        setCurrentGradeNames(names: string[]) {
            this.currentGradeNames = names;
            localStorage.setItem('currentGradeNames', JSON.stringify(names));
        },
        async fetchGrades() {
            try {
                const grades = await GradeService.getGrades();
                if (grades) {
                    this.grades = grades;
                    console.log(this.grades);
                    const storedGradeIds = localStorage.getItem('currentGradeIds');
                    if (storedGradeIds) {
                        const gradeIds = JSON.parse(storedGradeIds) as number[];
                        const storedGrades = this.grades.filter(grade => gradeIds.includes(grade.id!));
                        this.setCurrentGrades(storedGrades);
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
                    // 将获取的年级添加到当前选中年级列表中
                    this.currentGrades.push(grade);
                    // 更新当前选中年级的名称列表
                    this.currentGradeNames.push(grade.name);
                    // 存储当前选中年级的名称
                    localStorage.setItem('currentGradeNames', JSON.stringify(this.currentGradeNames));
                }
            } catch (error) {
                console.error('获取年级详细信息失败:', error);
            }
        },
        async createGrade(gradeData: Grade) {
            try {
                const newGrade = await GradeService.createGrade(gradeData);
                if (newGrade) {
                    // 将新创建的年级添加到当前选中年级列表中
                    this.currentGrades.push(newGrade);
                    // 更新当前选中年级的名称列表
                    this.currentGradeNames.push(newGrade.name);
                    // 存储当前选中年级的名称
                    localStorage.setItem('currentGradeNames', JSON.stringify(this.currentGradeNames));
                }
            } catch (error) {
                console.error('创建年级失败:', error);
            }
        },
        async updateGrade(gradeId: number, gradeData: Grade) {
            try {
                const updatedGrade = await GradeService.updateGrade(gradeId, gradeData);
                if (updatedGrade) {
                    // 更新当前选中年级列表中对应年级的数据
                    const index = this.currentGrades.findIndex(g => g.id === gradeId);
                    if (index !== -1) {
                        this.currentGrades[index] = updatedGrade;
                        // 更新当前选中年级的名称列表
                        this.currentGradeNames[index] = updatedGrade.name;
                        // 存储当前选中年级的名称
                        localStorage.setItem('currentGradeNames', JSON.stringify(this.currentGradeNames));
                    }
                }
            } catch (error) {
                console.error('更新年级信息失败:', error);
            }
        },
        async deleteGrade(gradeId: number) {
            try {
                await GradeService.deleteGrade(gradeId);
                // 从当前选中年级列表中移除对应年级的数据
                this.currentGrades = this.currentGrades.filter(g => g.id !== gradeId);
                // 找到要删除的年级名称并从当前选中年级名称列表中移除
                const gradeNameIndex = this.currentGradeNames.findIndex(name => name === this.grades.find(grade => grade.id === gradeId)?.name);
                if (gradeNameIndex !== -1) {
                    this.currentGradeNames.splice(gradeNameIndex, 1);
                    // 存储当前选中年级的名称
                    localStorage.setItem('currentGradeNames', JSON.stringify(this.currentGradeNames));
                }
            } catch (error) {
                console.error('删除年级失败:', error);
            }
        }
    }
});
