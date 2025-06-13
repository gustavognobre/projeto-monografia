// ServerPage.tsx
import { getAllUserExamResults } from "@/lib/get-exams";
import { UserInfo } from "@/components/main/UserInfo.component";
import ClientExamSearch from "@/components/main/ClientExamSearch.component";


export default async function ServerPage() {
  const result = await getAllUserExamResults();

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
      <ClientExamSearch exams={examsWithData} />
    </div>
  );
}
