import { createExam } from "@/actions/exams";
import AddExam from "@/components/ExamParams/AddExam.component";
import ExamList from "@/components/ExamParams/ListExam.component";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function ExamParameter() {
  return (
    <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
        <ExamList/>
    </main>
  );
}
