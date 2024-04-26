// src/utils/lookupHelpers.ts
import { useSubjectStore } from '@/stores/subjectStore';
import { useGradeStore } from '@/stores/gradeStore';
import { useTextbookVersionStore } from '@/stores/textbookVersionStore';

export function findSubjectId(subjectName: string): number | undefined {
    const subjectStore = useSubjectStore();
    console.log('查找科目:', subjectName, '可用科目:', subjectStore.subjects);
    const subject = subjectStore.subjects.find(s => s.name === subjectName.trim());
    return subject?.id;
}

export function findGradeId(gradeName: string): number | undefined {
    const gradeStore = useGradeStore();
    console.log('查找年级:', gradeName, '可用年级:', gradeStore.grades);
    const grade = gradeStore.grades.find(g => g.name === gradeName.trim());
    return grade?.id;
}

export function findTextbookVersionId(publisherName: string): number | undefined {
    const textbookVersionStore = useTextbookVersionStore();
    console.log('查找教材版本:', publisherName, '可用教材版本:', textbookVersionStore.textbookVersions);
    const textbookVersion = textbookVersionStore.textbookVersions.find(tv => tv.publisher === publisherName.trim());
    return textbookVersion?.id;
}
