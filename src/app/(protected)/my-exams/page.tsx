import { MyExamsClient } from '@/components/main/ExamsSearch.component';
import { currentUser } from '@/lib/auth'; 
import { getAllUserExam } from '@/lib/get-exams';

export default async function MyExamsPage() {
  const user = await currentUser();

  if (!user) {
    return <div>Usuário não autenticado</div>;
  }

  const exams = (await getAllUserExam()) || [];

  return <MyExamsClient exams={exams} />;
}
