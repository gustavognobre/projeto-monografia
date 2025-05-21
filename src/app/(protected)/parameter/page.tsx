import ExamList from "@/components/ExamParams/ListExam.component";
import { db } from "@/lib/db";

export default async function ExamParameter() {
    const exams = await db.exam.findMany({
        orderBy: { name: "desc" },
    });
    return (
        <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
            <ExamList exams={exams} />
        </main>
    );
}
