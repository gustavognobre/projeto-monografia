import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function getAllUserExamResults() {
  const thisUser = await currentUser();
  if (!thisUser) return null;

  // Pega o usuário completo (opcional)
  const user = await db.user.findUnique({
    where: { id: thisUser.id },
  });
  if (!user) return null;

  // Pega todos os exames com dados do usuário, relacionando exam + exam_data
  const examsWithData = await db.exam.findMany({
    where: {
      exam_data: {
        some: {
          userId: thisUser.id,
        },
      },
    },
    include: {
      exam_data: {
        where: { userId: thisUser.id },
        orderBy: { dateExam: "asc" }, // ordena por data para evolução
      },
    },
  });

  return { user, examsWithData };
}

export async function getAllUserExam() {
  const thisUser = await currentUser();
  if (!thisUser) return null;

  const exams = await db.exam_data.findMany({
    where: {
      userId: thisUser.id,
    },
    include: {
      exam: true, // 🔗 inclui os dados do exame associado
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return exams;
}

export async function getAllUserExamById(id: string) {
  if (!id) return null;
  console.log("aqui",id)
  const exams = await db.exam_data.findMany({
    where: {
      userId:id
    },
    include: {
      exam: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log("chegou", exams)
  return exams;
}

export async function getAllAnthropometry() {
  const thisUser = await currentUser();
  if (!thisUser) return null;

  const anthropometry = await db.anthropometry.findMany({
    where: {
      userId: thisUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return anthropometry;
}