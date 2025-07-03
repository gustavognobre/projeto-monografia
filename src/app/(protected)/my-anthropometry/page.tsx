import NewAntropometria from "@/components/newExam/NewAntropometria.component";
import { getAllAnthropometry } from "@/lib/get-exams";
import { getUser } from "@/lib/get-user";


export default async function Antropometria() {
  const anthropometry = (await getAllAnthropometry()) ?? [];
  const user = await getUser();
  return (
    <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
      <NewAntropometria anthropometry={anthropometry} user={user} />
    </main>
  );
}
