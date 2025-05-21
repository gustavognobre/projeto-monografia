import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react"; // ícone de adicionar

export default async function ExamList() {
  const exams = await db.exam.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center">
        Todos os Exames{" "}
        <span className="text-gray-500 text-lg">({exams.length})</span>
      </h1>

      <section className="w-full">
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {/* Card para adicionar novo exame */}
          <li className="p-6 border-2 border-dashed rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
            <Link href="/parameter/new" className="flex flex-col items-center text-blue-600 hover:underline">
              <Plus className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Novo Exame</span>
            </Link>
          </li>

          {/* Cards de exames */}
          {exams.length > 0 ? (
            exams.map((exam) => (
              <li
                key={exam.id}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col gap-2"
              >
                <Link href={`/parameter/${exam.id}`} className="hover:underline">
                  <h2 className="text-lg font-semibold text-blue-600">{exam.name}</h2>
                </Link>
                <p className="text-sm text-gray-600">Grupo: {exam.group}</p>
                <p className="text-sm text-gray-700">
                  Valores normais: {exam.normal_min} - {exam.normal_max}
                </p>
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
