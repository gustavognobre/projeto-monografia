import SimpleExamCards from "@/components/newExam/NewExam.component";
import { db } from "@/lib/db";
import { getUser } from "@/lib/get-user";

function calcularIdade(dataNascimento: string) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesDiff = hoje.getMonth() - nascimento.getMonth();
  const diaDiff = hoje.getDate() - nascimento.getDate();

  if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
    idade--;
  }

  return idade;
}

export default async function NewExam() {
  const user = await getUser();
  if (!user || !user.dateBirth) {
    return <h1>Usuário não autenticado ou data de nascimento não informada</h1>;
  }
  const idade = calcularIdade(user.dateBirth);
  const exams = await db.exam.findMany({
    orderBy: { name: "desc" },
  });

  return (
    <main className="flex flex-col items-center gap-10 px-4 pt-24 max-w-4xl mx-auto">
      <SimpleExamCards exams={exams} idade={idade} gender={user.gender} user={user}/>
    </main>
  );
}
