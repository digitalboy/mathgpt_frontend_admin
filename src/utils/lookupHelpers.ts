// src/utils/lookupHelpers.ts
import { useSubjectStore } from '@/stores/subjectStore';
import { useGradeStore } from '@/stores/gradeStore';
import { useTextbookVersionStore } from '@/stores/textbookVersionStore';

export function findSubjectId(subjectName: string): number | undefined {
    const subjectStore = useSubjectStore();
    const subject = subjectStore.subjects.find(s => s.name === subjectName);
    return subject?.id;
}

export function findGradeId(gradeName: string): number | undefined {
    const gradeStore = useGradeStore();
    const grade = gradeStore.grades.find(g => g.name === gradeName);
    return grade?.id;
}

export function findTextbookVersionId(publisherName: string): number | undefined {
    const textbookVersionStore = useTextbookVersionStore();
    const textbookVersion = textbookVersionStore.textbookVersions.find(tv => tv.publisher === publisherName);
    return textbookVersion?.id;
}
