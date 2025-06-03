"use client";

import { useState, useMemo } from "react";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteExam } from "@/actions/exams";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import AddExamForm from "../../modal/AddExam.component";
import ExamDetailsModal from "@/modal/ViewExam.modal";

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

const GROUPS = [
  "Todos",
  "Homens adultos (18–59)",
  "Mulheres adultas (18–59)",
  "Idosos (≥ 60 anos)",
  "Crianças (>10 anos)",
  "Crianças (<10 anos)",
];

export default function ExamList({ exams }: Props) {
    const router = useRouter();

    const [openAddModal, setOpenAddModal] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

    const [filterName, setFilterName] = useState("");
    const [filterGroup, setFilterGroup] = useState("Todos");

    async function handleDelete(id: string) {
        try {
            await deleteExam(id);
            router.refresh();
        } catch (error) {
            console.error("Erro ao deletar exame", error);
        }
    }

    const uniqueNames = useMemo(() => {
        const namesSet = new Set(exams.map((e) => e.name));
        return Array.from(namesSet);
    }, [exams]);

    const filteredExams = useMemo(() => {
        return exams.filter((exam) => {
            const nameMatch = filterName ? exam.name === filterName : true;
            const groupMatch = filterGroup === "Todos" ? true : exam.group === filterGroup;
            return nameMatch && groupMatch;
        });
    }, [exams, filterName, filterGroup]);

    return (
        <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center">
                Todos os Exames{" "}
                <span className="text-gray-500 text-lg">({filteredExams.length})</span>
            </h1>

            {/* Filtros */}
            <section className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                {/* Filtro por nome */}
                <Select
                    value={filterName || "__all__"}
                    onValueChange={(value) => setFilterName(value === "__all__" ? "" : value)}
                >
                    <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Filtrar por nome" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">Todos</SelectItem>
                        {uniqueNames.map((name) => (
                            <SelectItem key={name} value={name}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Filtro por grupo */}
                <Select
                    value={filterGroup}
                    onValueChange={(value) => setFilterGroup(value)}
                >
                    <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Filtrar por grupo" />
                    </SelectTrigger>
                    <SelectContent>
                        {GROUPS.map((group) => (
                            <SelectItem key={group} value={group}>
                                {group}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </section>

            <section className="w-full">
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {/* Card para novo exame */}
                    <li className="p-6 border-2 border-dashed rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
                        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
                            <DialogTrigger asChild>
                                <button className="flex flex-col items-center text-blue-600 hover:underline">
                                    <Plus className="w-10 h-10 mb-2" />
                                    <span className="text-sm font-medium">Novo Exame</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Cadastrar Novo Exame</DialogTitle>
                                </DialogHeader>
                                <AddExamForm
                                    onSuccess={() => {
                                        router.refresh();
                                        setOpenAddModal(false);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </li>

                    {/* Lista de exames filtrados */}
                    {filteredExams.length > 0 ? (
                        filteredExams.map((exam) => (
                            <li
                                key={exam.id}
                                onClick={() => {
                                    setSelectedExam(exam);
                                    setDetailsOpen(true);
                                }}
                                className="cursor-pointer p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col gap-2 relative"
                            >
                                <h2 className="text-lg font-semibold text-blue-600">
                                    {exam.name}
                                </h2>
                                <span className="text-xs text-gray-300">{exam.id}</span>
                                <p className="text-sm text-gray-600">Grupo: {exam.group}</p>
                                <p className="text-sm text-gray-700">
                                    Valores normais: {exam.normal_min ?? "-"} -{" "}
                                    {exam.normal_max ?? "-"}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(exam.id);
                                    }}
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

            {/* Modal de detalhes */}
            <ExamDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                exam={selectedExam}
            />
        </main>
    );
}
