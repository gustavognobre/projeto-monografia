"use client";

import { useState, useMemo } from "react";
import { ExamChart } from "../ExamParams/ExamChart.component";
import { Search } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  group: string;
  exam_data: any;
}

interface Props {
  exams: Exam[];
}

export default function ClientExamSearch({ exams }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return exams.filter((exam) => exam.name.toLowerCase().includes(term));
  }, [searchTerm, exams]);

  return (
    <main className="flex flex-col items-center px-6 py-10 bg-white min-h-screen">
      {/* Search input */}
      <section className="w-full max-w-lg mb-10">
        <label htmlFor="search" className="sr-only">Buscar exame</label>
        <div className="relative text-gray-400 focus-within:text-blue-600">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="search"
            type="search"
            placeholder="Buscar exame..."
            autoComplete="off"
            className="
              block w-full
              bg-gray-100
              rounded-md
              py-3 pl-10 pr-4
              text-gray-900
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
              focus:bg-white
              transition
              duration-200
              shadow-sm
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            spellCheck={false}
            aria-label="Buscar exame"
          />
        </div>
      </section>

      {/* Results */}
      <section className="w-full max-w-5xl space-y-10">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <MinimalExamBlock key={exam.id} exam={exam} />
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg mt-12">
            Nenhum exame encontrado para{" "}
            <span className="font-semibold text-gray-700">"{searchTerm}"</span>.
          </p>
        )}
      </section>
    </main>
  );
}

function MinimalExamBlock({ exam }: { exam: Exam }) {
  return (
    <article
      tabIndex={0}
      aria-label={`Exame ${exam.name}, grupo ${exam.group}`}
    >
      <ExamChart examInfo={exam} examData={exam.exam_data} />
    </article>
  );
}
