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
                }
            } catch (error) {
                console.error('Failed to load explanations:', error);
            }
        },
        async fetchExplanationById(id: number) {
            try {
                const explanation = await KPExplanationService.getExplanationById(id);
                if (explanation) {
                    this.setCurrentExplanation(explanation);
                }
            } catch (error) {
                console.error(`Failed to get explanation details for ID ${id}:`, error);
            }
        },
        async createExplanation(explanationData: KPExplanation) {
            try {
                const newExplanation = await KPExplanationService.createExplanation(explanationData);
                if (newExplanation) {
                    this.explanations.push(newExplanation);
                    this.setCurrentExplanation(newExplanation);
                }
            } catch (error) {
                console.error('Failed to create explanation:', error);
            }
        },
        async updateExplanation(id: number, explanationData: KPExplanation) {
            try {
                const updatedExplanation = await KPExplanationService.updateExplanation(id, explanationData);
                if (updatedExplanation) {
                    const index = this.explanations.findIndex(e => e.id === id);
                    if (index !== -1) {
                        this.explanations[index] = updatedExplanation;
                        this.setCurrentExplanation(updatedExplanation);
                    }
                }
            } catch (error) {
                console.error(`Failed to update explanation for ID ${id}:`, error);
            }
        },
        async deleteExplanation(id: number) {
            try {
                await KPExplanationService.deleteExplanation(id);
                this.explanations = this.explanations.filter(e => e.id !== id);
                if (this.currentExplanation?.id === id) {
                    this.currentExplanation = null;
                }
            } catch (error) {
                console.error(`Failed to delete explanation for ID ${id}:`, error);
            }
        }
    }
});