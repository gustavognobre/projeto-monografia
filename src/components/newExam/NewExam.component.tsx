"use client";

import { useState, useMemo, useEffect } from "react";
import ExamModal from "@/modal/AddExam.modal";

interface Exam {
  id: string;
  name: string;
  group: string;
  normal_min: number | null;
  normal_max: number | null;
  intermediary_min?: number | null;
  intermediary_max?: number | null;
  hard_value?: number | null;
}

interface User {
  id: string;
  name: string | null;
  gender: string | null;
}


interface Props {
  exams: Exam[];
  idade: number;
  gender: string | null;
  user: User;
}


function getGroupByAgeAndGender(idade: number, gender: string): string {
    const g = gender.trim().toLowerCase();

    if (idade >= 60) return "idosos (≥ 60 anos)";
    if (idade >= 18 && idade <= 59) {
        if (g === "male") return "homens adultos (18–59)";
        if (g === "female") return "mulheres adultas (18–59)";
        return "adultos (18–59)";
    }
    if (idade > 10 && idade < 18) return "crianças (>10 anos)";
    if (idade <= 10) return "crianças (<10 anos)";
    return "todos";
}

export default function SimpleExamCards({ exams, idade, gender, user }: Props) {
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce simples para search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
        return () => clearTimeout(timer);
    }, [search]);

   const groupFilter = useMemo(() => getGroupByAgeAndGender(idade, gender ?? ""), [idade, gender]);


    // Filtra pelo grupo e pelo search
    const filteredExams = useMemo(() => {
        return exams.filter((exam) => {
            const examGroupLower = exam.group.trim().toLowerCase();
            const matchesGroup =
                groupFilter === "todos" ||
                examGroupLower === "todos" ||
                examGroupLower.includes(groupFilter);
            const matchesSearch = exam.name.toLowerCase().includes(debouncedSearch);
            return matchesGroup && matchesSearch;
        });
    }, [exams, groupFilter, debouncedSearch]);

    const openModal = (exam: Exam) => {
        setSelectedExam(exam);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedExam(null);
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                Exames disponíveis <span className="text-indigo-600">({filteredExams.length})</span>
            </h1>

            {/* Search input */}
            <div className="max-w-md mx-auto mb-10">
                <input
                    type="search"
                    placeholder="Buscar exame pelo nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    aria-label="Buscar exame pelo nome"
                />
            </div>

            {filteredExams.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Nenhum exame encontrado.</p>
            ) : (
                <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filteredExams.map((exam) => (
                        <li
                            key={exam.id}
                            onClick={() => openModal(exam)}
                            className="bg-white rounded-xl p-5 shadow hover:shadow-md cursor-pointer transition duration-200 border border-gray-200 flex flex-col gap-3 hover:border-blue-300"
                        >
                            {/* Esquerda: Nome e grupo */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-semibold text-gray-900 break-words leading-snug">
                                    {exam.name}
                                </h2>

                                <p className="mt-1 inline-block text-xs font-semibold rounded-full px-3 py-1 bg-indigo-100 text-indigo-800 tracking-wide select-none">
                                    {exam.group}
                                </p>
                            </div>

                            {/* Direita: Valores normais */}
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end whitespace-nowrap min-w-[120px]">
                                <span className="text-xs font-medium text-gray-500 uppercase">
                                    Valores normais
                                </span>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Valores normais:</span>{" "}
                                    {exam.normal_min ?? "-"} — {exam.normal_max ?? "-"}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showModal && selectedExam && (
                <ExamModal exam={selectedExam} onClose={closeModal} user={user} />
            )}
        </main>
    );
}
