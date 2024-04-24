// stores/textbookVersionStore.ts
import { defineStore } from 'pinia';
import { TextbookVersion, TextbookVersionService } from '@/services/textbookVersionService';

export const useTextbookVersionStore = defineStore('textbookVersion', {
    state: () => ({
        textbookVersions: [] as TextbookVersion[],
        currentTextbookVersion: null as TextbookVersion | null,
    }),
    actions: {
        setCurrentTextbookVersion(textbookVersion: TextbookVersion | null) {
            this.currentTextbookVersion = textbookVersion;
        },
        async fetchTextbookVersions() {
            try {
                const textbookVersions = await TextbookVersionService.getTextbookVersions();
                if (textbookVersions) {
                    this.textbookVersions = textbookVersions;
                }
            } catch (error) {
                console.error('加载教材版本列表失败:', error);
            }
        },
        async fetchTextbookVersionById(textbookVersionId: number) {
            try {
                const textbookVersion = await TextbookVersionService.getTextbookVersionById(textbookVersionId);
                if (textbookVersion) {
                    this.setCurrentTextbookVersion(textbookVersion);
                }
            } catch (error) {
                console.error('获取教材版本详细信息失败:', error);
            }
        },
        async createTextbookVersion(textbookVersionData: TextbookVersion) {
            try {
                const newTextbookVersion = await TextbookVersionService.createTextbookVersion(textbookVersionData);
                if (newTextbookVersion) {
                    this.textbookVersions.push(newTextbookVersion);
                    this.setCurrentTextbookVersion(newTextbookVersion);
                }
            } catch (error) {
                console.error('创建教材版本失败:', error);
            }
        },
        async updateTextbookVersion(textbookVersionId: number, textbookVersionData: TextbookVersion) {
            try {
                const updatedTextbookVersion = await TextbookVersionService.updateTextbookVersion(textbookVersionId, textbookVersionData);
                if (updatedTextbookVersion) {
                    const index = this.textbookVersions.findIndex(tv => tv.id === textbookVersionId);
                    if (index !== -1) {
                        this.textbookVersions[index] = updatedTextbookVersion;
                        this.setCurrentTextbookVersion(updatedTextbookVersion);
                    }
                }
            } catch (error) {
                console.error('更新教材版本信息失败:', error);
            }
        },
        async deleteTextbookVersion(textbookVersionId: number) {
            try {
                await TextbookVersionService.deleteTextbookVersion(textbookVersionId);
                this.textbookVersions = this.textbookVersions.filter(tv => tv.id !== textbookVersionId);
                if (this.currentTextbookVersion?.id === textbookVersionId) {
                    this.currentTextbookVersion = null;
                }
            } catch (error) {
                console.error('删除教材版本失败:', error);
            }
        }
    }
});
