import { getAllUserExamResults } from "@/lib/get-exams";
import { UserInfo } from "@/components/main/UserInfo.component";
import ClientExamSearch from "@/components/main/ClientExamSearch.component";
import { FileQuestion } from "lucide-react"; // ícone opcional

export default async function ServerPage() {
  const result = await getAllUserExamResults();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
        <FileQuestion className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold">Usuário não autenticado</h1>
        <p className="text-sm mt-2">Faça login para visualizar os exames disponíveis.</p>
      </div>
    );
  }

  const { user, examsWithData } = result;

  if (examsWithData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
        <FileQuestion className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold">Nenhum exame disponível</h1>
        <p className="text-sm mt-2 max-w-md">
          No momento, não há resultados laboratoriais cadastrados para este usuário. 
          Por favor, entre em contato com o responsável ou aguarde o próximo registro.
        </p>
      </div>
    );
  }

  return (
    <div>
      <UserInfo user={user} />
      <ClientExamSearch exams={examsWithData} />
    </div>
  );
}
