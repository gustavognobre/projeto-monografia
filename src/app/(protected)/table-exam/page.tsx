// app/my-exams/page.tsx (server component)
import { getAllUserExamResults } from '@/lib/get-exams';
import { UserInfo } from '@/components/main/UserInfo.component';
import { MyExamsClient } from '@/components/main/ExamsSearch.component';


interface User {
  id: string;
  name: string;
  email?: string;
  // outras props relevantes do usuário
}

interface ExamResult {
  id: string;
  exam: {
    name: string;
    group: string;
    unit: string;
    normal_min?: number;
    normal_max?: number;
    intermediary_min?: number;
    intermediary_max?: number;
    hard_value?: number;
  };
  value: number | null;
  notes?: string | null;
  dateExam?: string | null;
  createdAt?: string | null;
  lab: string;
  show?: boolean; // flag para controle local
}

interface ExamResultsResponse {
  user: User;
  examsWithData: ExamResult[];
}

export default async function MyExamsPage() {
  const result: ExamResultsResponse | null = await getAllUserExamResults();

  if (!result || !result.user) {
    return <h1>Usuário não autenticado ou não encontrado</h1>;
  }

  const { user, examsWithData } = result;

  if (!examsWithData || examsWithData.length === 0) {
    return <h1>Não há exames para este usuário</h1>;
  }

  return (
    <div>
      <UserInfo user={user} />
      <MyExamsClient exams={examsWithData} />
    </div>
  );
}
