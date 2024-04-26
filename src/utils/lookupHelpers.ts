// src/utils/lookupHelpers.ts
import { useSubjectStore } from '@/stores/subjectStore';
import { useGradeStore } from '@/stores/gradeStore';
import { useTextbookVersionStore } from '@/stores/textbookVersionStore';

async function ensureSubjectsLoaded() {
    const subjectStore = useSubjectStore();
    if (subjectStore.subjects.length === 0) {
        console.log('科目数据为空，正在从服务器加载...');
        await subjectStore.fetchSubjects();
    }
}

async function ensureGradesLoaded() {
    const gradeStore = useGradeStore();
    if (gradeStore.grades.length === 0) {
        console.log('年级数据为空，正在从服务器加载...');
        await gradeStore.fetchGrades();
    }
}

async function ensureTextbookVersionsLoaded() {
    const textbookVersionStore = useTextbookVersionStore();
    if (textbookVersionStore.textbookVersions.length === 0) {
        console.log('教材版本数据为空，正在从服务器加载...');
        await textbookVersionStore.fetchTextbookVersions();
    }
}

export async function findSubjectId(subjectName: string): Promise<number | undefined> {
    await ensureSubjectsLoaded();
    const subjectStore = useSubjectStore();
    console.log("subjectStore.subjects",subjectStore.subjects)
    const subject = subjectStore.subjects.find(s => s.name === subjectName.trim());
    return subject?.id;
}

export async function findGradeId(gradeName: string): Promise<number | undefined> {
    await ensureGradesLoaded();
    const gradeStore = useGradeStore();
    const grade = gradeStore.grades.find(g => g.name === gradeName.trim());
    return grade?.id;
}

export async function findTextbookVersionId(publisherName: string): Promise<number | undefined> {
    await ensureTextbookVersionsLoaded();
    const textbookVersionStore = useTextbookVersionStore();
    const textbookVersion = textbookVersionStore.textbookVersions.find(tv => tv.publisher === publisherName.trim());
    return textbookVersion?.id;
}
