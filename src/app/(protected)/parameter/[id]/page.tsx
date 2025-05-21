import { db } from "@/lib/db";

interface ExamCardProps {
  params: {
    id: string;
  };
}

export default async function ExamCard({ params }: ExamCardProps) {
  const exam = await db.exam.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!exam) {
    return (
      <main className="pt-24 text-center">
        <h1 className="text-2xl text-red-600">Exame não encontrado</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-bold">{exam.name}</h1>
      <p className="text-lg text-gray-700">
        Valor Normal: {exam.normal_min} - {exam.normal_max}
      </p>
      <p className="text-md text-gray-500">
        Grupo: {exam.group}
      </p>
    </main>
  );
}
