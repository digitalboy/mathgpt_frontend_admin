// src/types/index.ts
export interface QuestionData {
    question_type: string;
    bloom_taxonomy_level: string;
    question_text: string;
    options: Array<{
        option_id: string;
        option_text: string;
    }>;
    correct_answer: string[];
    explanation?: string;
    difficulty_level: string;
    selectedOption?: string; // 将属性设置为可选属性
    id?: number; // 将属性设置为可选属性
    showResult?: boolean; // 将属性设置为可选属性
    resultType?: 'success' | 'error'; // 将属性设置为可选属性
}
