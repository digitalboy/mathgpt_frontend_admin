// services/questionService.ts
import { BaseService } from './baseService';

interface Question {
    id?: number;
    question_type: string;
    bloom_taxonomy_level: string;
    question_text: string;
    options: Array<{ option_id: string; option_text: string }>;
    correct_answer: string[];
    explanation: string;
    difficulty_level: string;
    source?: string;
}

export class QuestionService extends BaseService {
    // 创建题目
    public static async createQuestion(questionData: Question): Promise<Question | undefined> {
        try {
            const response = await this.axiosInstance.post<Question>('/question/new', questionData);
            console.log('题目创建成功！');
            return response.data;
        } catch (error) {
            console.error('创建题目失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取所有题目的列表
    public static async getQuestions(): Promise<Question[] | undefined> {
        try {
            const response = await this.axiosInstance.get<Question[]>('/question/get');
            console.log('题目列表获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取题目列表失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 获取单个题目的详细信息
    public static async getQuestionById(questionId: number): Promise<Question | undefined> {
        try {
            const response = await this.axiosInstance.get<Question>(`/question/get/${questionId}`);
            console.log('题目详细信息获取成功！');
            return response.data;
        } catch (error) {
            console.error('获取题目信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 更新题目信息
    public static async updateQuestion(questionId: number, questionData: Question): Promise<Question | undefined> {
        try {
            const response = await this.axiosInstance.put<Question>(`/question/update/${questionId}`, questionData);
            console.log('题目信息更新成功！');
            return response.data;
        } catch (error) {
            console.error('更新题目信息失败：', error);
            this.handleError(error);
            return undefined;
        }
    }

    // 删除题目
    public static async deleteQuestion(questionId: number): Promise<void | undefined> {
        try {
            const response = await this.axiosInstance.delete(`/question/delete/${questionId}`);
            console.log('题目删除成功！');
            return response.data;
        } catch (error) {
            console.error('删除题目失败：', error);
            this.handleError(error);
            return undefined;
        }
    }
}
