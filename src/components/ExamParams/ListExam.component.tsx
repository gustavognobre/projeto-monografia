"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteExam } from "@/actions/exams";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddExamForm from "./AddExam.component";

interface Exam {
    id: string;
    name: string;
    group: string;
    normal_min: number | null;
    normal_max: number | null;
}

interface Props {
    exams: Exam[];
}

export default function ExamList({ exams }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    async function handleDelete(id: string) {
        try {
            await deleteExam(id);
            router.refresh();
        } catch (error) {
            console.error("Erro ao deletar exame", error);
        }
    }

    return (
        <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center">
                Todos os Exames <span className="text-gray-500 text-lg">({exams.length})</span>
            </h1>

            <section className="w-full">
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {/* Card que abre modal */}
                    <li className="p-6 border-2 border-dashed rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button className="flex flex-col items-center text-blue-600 hover:underline">
                                    <Plus className="w-10 h-10 mb-2" />
                                    <span className="text-sm font-medium">Novo Exame</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Cadastrar Novo Exame</DialogTitle>
                                </DialogHeader>
                                <AddExamForm
                                    onSuccess={() => {
                                        router.refresh();
                                        setOpen(false);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </li>

                    {/* Lista de exames */}
                    {exams.length > 0 ? (
                        exams.map((exam) => (
                            <li
                                key={exam.id}
                                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col gap-2 relative"
                            >
                                <a href={`/parameter/${exam.id}`} className="hover:underline">
                                    <h2 className="text-lg font-semibold text-blue-600">
                                        {exam.name}
                                    </h2>
                                </a>
                                <p className="text-sm text-gray-600">Grupo: {exam.group}</p>
                                <p className="text-sm text-gray-700">
                                    Valores normais: {exam.normal_min ?? "-"} -{" "}
                                    {exam.normal_max ?? "-"}
                                </p>
                                <button
                                    onClick={() => handleDelete(exam.id)}
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                    aria-label={`Deletar Exame ${exam.name}`}
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-gray-500 border rounded-lg bg-gray-50 col-span-full">
                            Nenhum exame encontrado.
                        </li>
                    )}
                </ul>
            </section>
        </main>
    );
}
