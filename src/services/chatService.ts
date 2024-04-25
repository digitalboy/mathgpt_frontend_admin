// services/chatService.ts
import { BaseService } from './baseService';

export class ChatService extends BaseService {
    // 发送聊天消息到后端并获取AI的响应
    static async ask(messages:{}): Promise<any> {
        console.log(messages)
        try {
            const response = await this.axiosAIInstance.post('/ask', messages );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch AI response:', error);
            this.handleError(error);
        }
    }
}
