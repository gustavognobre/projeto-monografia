// scripts/seed-exam-data.ts
import { db } from "@/lib/db";

function getRandomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getRandomPastDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split("T")[0]; // formato YYYY-MM-DD
}

async function seedExamData() {
  const examId = "cmbo90ttb000godqsnpgci9td";
  const userId = "cm8suzdpf0000odxzgtwhr37k";

  const records = Array.from({ length: 10 }).map(() => ({
    show: true,
    examId,
    userId,
    value: getRandomFloat(60, 180),
    notes: null,
    dateExam: getRandomPastDate(60),
  }));

  await db.exam_data.createMany({
    data: records,
  });

  console.log("✅ Dados de exames aleatórios inseridos com sucesso.");
}

seedExamData()
  .catch((e) => {
    console.error("❌ Erro ao inserir dados:", e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
