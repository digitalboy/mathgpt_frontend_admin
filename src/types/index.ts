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
    explanation: string;
    difficulty_level: string;
    selectedOption?: string;
    id?: number;
    showResult?: boolean;
    resultType?: 'success' | 'error';
}
