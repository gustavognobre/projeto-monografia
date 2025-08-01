import { getAllUserExamById, getAllUserExamResults, getAllUserExamResultsByUserId } from "@/lib/get-exams";
import { UserInfo } from "@/components/main/UserInfo.component";
import { ExamsToggle } from "@/components/medical/ExamsToggle.components";


interface ServerPageProps {
  params: { id: string };
}

export default async function ServerPage({ params }: ServerPageProps) {
  const id = params.id;

  // Dados para listagem simples
  const exams = (await getAllUserExamById(id)) || [];

  // Dados para gráficos e análise
  const result = await getAllUserExamResultsByUserId(id);
  if (!result) {
    return <h1>Usuário não autenticado ou não encontrado</h1>;
  }

  const { user, examsWithData } = result;
  if (examsWithData.length === 0) {
    return <h1>Não há exames para este usuário</h1>;
  }

  return (
    <div>
      <UserInfo user={user} />
      <ExamsToggle exams={exams} examsWithData={examsWithData} />
    </div>
  );
}
