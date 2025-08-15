import { MyExamsClient } from "@/components/main/ExamsSearch.component";
import { getAllUserExamById } from "@/lib/get-exams";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Teste({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const exams = (await getAllUserExamById(id)) || [];
  console.log(exams);

   return <MyExamsClient exams={exams} />;
}
