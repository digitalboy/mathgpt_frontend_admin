// stores/questionStore.ts
import { defineStore } from 'pinia';
import { Question, QuestionService } from '@/services/questionService';

export const useQuestionStore = defineStore('question', {
    state: () => ({
        questions: [] as Question[],
        currentQuestion: null as Question | null,
    }),
    actions: {
        setCurrentQuestion(question: Question) {
            this.currentQuestion = question;
        },
        async fetchQuestions() {
            try {
                const questions = await QuestionService.getQuestions();
                if (questions) {
                    this.questions = questions;
                }
            } catch (error) {
                console.error('加载题目列表失败:', error);
            }
        },
        async fetchQuestionById(questionId: number) {
            try {
                const question = await QuestionService.getQuestionById(questionId);
                if (question) {
                    this.setCurrentQuestion(question);
                }
            } catch (error) {
                console.error('获取题目详细信息失败:', error);
            }
        },
        async createQuestion(questionData: Question) {
            try {
                const newQuestion = await QuestionService.createQuestion(questionData);
                if (newQuestion) {
                    this.questions.push(newQuestion);
                    this.setCurrentQuestion(newQuestion);
                }
            } catch (error) {
                console.error('创建题目失败:', error);
            }
        },
        async updateQuestion(questionId: number, questionData: Question) {
            try {
                const updatedQuestion = await QuestionService.updateQuestion(questionId, questionData);
                if (updatedQuestion) {
                    const index = this.questions.findIndex(q => q.id === questionId);
                    if (index !== -1) {
                        this.questions[index] = updatedQuestion;
                        this.setCurrentQuestion(updatedQuestion);
                    }
                }
            } catch (error) {
                console.error('更新题目信息失败:', error);
            }
        },
        async deleteQuestion(questionId: number) {
            try {
                await QuestionService.deleteQuestion(questionId);
                this.questions = this.questions.filter(q => q.id !== questionId);
                if (this.currentQuestion?.id === questionId) {
                    this.currentQuestion = null;
                }
            } catch (error) {
                console.error('删除题目失败:', error);
            }
        }
    }
});
