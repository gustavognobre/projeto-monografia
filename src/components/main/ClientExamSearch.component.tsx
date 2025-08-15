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
      <section className="w-full max-w-lg mb-12">
        <label htmlFor="search" className="sr-only">
          Buscar exame
        </label>
        <div className="relative text-blue-400 focus-within:text-blue-600">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400"
            aria-hidden="true"
          />
          <input
            id="search"
            type="search"
            placeholder="Buscar exame..."
            autoComplete="off"
            spellCheck={false}
            aria-label="Buscar exame"
            className="
              block w-full
              rounded-md
              bg-gray-100
              py-3 pl-10 pr-4
              text-gray-900
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-600
              focus:ring-offset-1
              focus:bg-white
              shadow-sm
              transition
              duration-200
              caret-blue-600
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Results */}
      <section
        className="w-full max-w-5xl space-y-10"
        role="list"
        aria-live="polite"
        aria-atomic="true"
      >
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <article
              key={exam.id}
              tabIndex={0}
              role="listitem"
              aria-label={`Exame ${exam.name}, grupo ${exam.group}`}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <ExamChart examInfo={exam} examData={exam.exam_data} />
            </article>
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
