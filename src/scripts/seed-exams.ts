// scripts/seed-exams.ts
import { db } from "@/lib/db";

async function seedExams() {
  await db.exam.createMany({
    data: [
      {
        name: "GLICEMIA",
        group: "Homens adultos (18–59)",
        normal_min: 70,
        normal_max: 99,
        intermediary_min: 100,
        intermediary_max: 125,
        hard_value: 126,
      },
      {
        name: "GLICEMIA",
        group: "Mulheres adultas (18–59)",
        normal_min: 70,
        normal_max: 99,
        intermediary_min: 100,
        intermediary_max: 125,
        hard_value: 126,
      },
      {
        name: "GLICEMIA",
        group: "Idosos (≥ 60 anos)",
        normal_min: 70,
        normal_max: 99,
        intermediary_min: 100,
        intermediary_max: 125,
        hard_value: 126,
      },
      {
        name: "GLICEMIA",
        group: "Crianças (>10 anos)",
        normal_min: 70,
        normal_max: 99,
        intermediary_min: 100,
        intermediary_max: 125,
        hard_value: 126,
      },
      {
        name: "GLICEMIA",
        group: "Crianças (<10 anos)",
        normal_min: 65,
        normal_max: 99,
        intermediary_min: 100,
        intermediary_max: 125,
        hard_value: 126,
      }
    ]
  });

  console.log("Exames inseridos com sucesso.");
}

seedExams()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
