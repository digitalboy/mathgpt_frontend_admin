// services/chatService.ts
import { BaseService } from './baseService';

export class ChatService extends BaseService {
    // 发送聊天消息到后端并获取AI的响应
    static async grokAIResponse(messages: {}): Promise<any> {
        console.log(messages)
        try {
            const response = await this.axiosAIInstance.post('/ask', messages);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch AI response:', error);
            this.handleError(error);
        }
    }

    /**
     * 调用AI服务生成与用户输入相关的AI响应
     * @param system_instruction 系统指令
     * @param user_input 用户输入
     * @returns AI生成的响应内容或者在出现错误时返回undefined
     */
    static async googleAIResponse(system_instruction: string, user_input: string): Promise<string | undefined> {
        console.log('Generating AI response...');
        try {
            const response = await this.axiosAIInstance.post('/google', {
                system_instruction: system_instruction,
                user_input: user_input
            });
            return response.data.response;
        } catch (error) {
            console.error('Failed to generate AI response:', error);
            this.handleError(error);
            return undefined; // 出现错误时返回undefined
        }
    }
}
