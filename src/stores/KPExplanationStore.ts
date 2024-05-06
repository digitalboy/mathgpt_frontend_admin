// stores/KPExplanationStore.ts
import { defineStore } from 'pinia';
import { KPExplanation, KPExplanationService } from '@/services/KPExplanationService';

export const useKPExplanationStore = defineStore('kpExplanation', {
    state: () => ({
        explanations: [] as KPExplanation[],
        currentExplanation: null as KPExplanation | null,
    }),
    getters: {
        getCurrentExplanationDetails: (state) => state.currentExplanation,
    },
    actions: {
        setCurrentExplanation(explanation: KPExplanation | null) {
            this.currentExplanation = explanation;
        },
        async fetchExplanations() {
            try {
                const explanations = await KPExplanationService.getExplanations();
                if (explanations) {
                    this.explanations = explanations;
                    return explanations;
                }
            } catch (error) {
                console.error('Failed to load explanations:', error);
                return null;
            }
        },

        async fetchExplanationsByUUID(uuid: string) {
            try {
                const explanations = await KPExplanationService.getExplanationByUUID(uuid); // 使用新的服务方法
                if (explanations) {
                    this.explanations = explanations;
                    return explanations;
                }
            } catch (error) {
                console.error(`Failed to load explanations for UUID ${uuid}:`, error);
            }
        },

        async fetchExplanationById(id: number) {
            try {
                const explanation = await KPExplanationService.getExplanationById(id);
                if (explanation) {
                    this.setCurrentExplanation(explanation);
                    return explanation;
                }
            } catch (error) {
                console.error(`Failed to get explanation details for ID ${id}:`, error);
                return null;
            }
        },
        async createExplanation(explanationData: KPExplanation) {
            try {
                const newExplanation = await KPExplanationService.createExplanation(explanationData);
                if (newExplanation) {
                    this.explanations.push(newExplanation);
                    this.setCurrentExplanation(newExplanation);
                    return newExplanation;  // 成功时返回新的解释对象
                }
            } catch (error) {
                console.error('Failed to create explanation:', error);
            }
            return null;  // 失败时返回 null
        }, 
        async updateExplanation(id: number, explanationData: KPExplanation) {
            try {
                const updatedExplanation = await KPExplanationService.updateExplanation(id, explanationData);
                if (updatedExplanation) {
                    const index = this.explanations.findIndex(e => e.id === id);
                    if (index !== -1) {
                        this.explanations[index] = updatedExplanation;
                        this.setCurrentExplanation(updatedExplanation);
                        return updatedExplanation;  // 成功时返回更新后的解释对象
                    }
                }
            } catch (error) {
                console.error(`Failed to update explanation for ID ${id}:`, error);
            }
            return null;  // 失败时返回 null
        },
        async deleteExplanation(id: number) {
            try {
                await KPExplanationService.deleteExplanation(id);
                this.explanations = this.explanations.filter(e => e.id !== id);
                if (this.currentExplanation?.id === id) {
                    this.currentExplanation = null;
                }
                return true;  // 成功时返回 true
            } catch (error) {
                console.error(`Failed to delete explanation for ID ${id}:`, error);
                return false;  // 失败时返回 false
            }
        }
    }
});