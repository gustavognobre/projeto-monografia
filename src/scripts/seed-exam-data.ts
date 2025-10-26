// scripts/seed-exam-data.ts

import { db } from "@/lib/db";

// ID do usuário alvo fornecido
const TARGET_USER_ID = "cmglho7vm0000odypoque3lzf";

// --- Funções Utilitárias ---
function getRandomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getRandomPastDate(daysBack: number, referenceDate: Date): string {
  const date = new Date(referenceDate);
  // Garante que a data do exame seja um pouco anterior à data de referência
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split("T")[0]; // formato YYYY-MM-DD
}

// --- Definição dos Parâmetros de Evolução para CADA Exame ---

interface ExamSeries {
  examId: string;
  startValue: number;      // Valor base para o 1º exame (mais antigo)
  changePerExam: number;   // Mudança média (positiva ou negativa) por exame
  fluctuation: number;     // Variação aleatória (ruído)
  rangeMin: number;        // Limite inferior para o valor gerado
  rangeMax: number;        // Limite superior para o valor gerado
}

// Mapeamento de todos os seus 28 exames com IDs e lógica de evolução
const EXAMS_TO_SEED: ExamSeries[] = [
  // IDs com cmgk2q5t4...
  { examId: "cmgk2q5t40000od86alr1fa3h", startValue: 90, changePerExam: 1.5, fluctuation: 1, rangeMin: 70, rangeMax: 150 }, // GLICEMIA DE JEJUM (Piora)
  { examId: "cmgk2q5t40001od86l0qpi8d4", startValue: 5.4, changePerExam: 0.08, fluctuation: 0.05, rangeMin: 4.0, rangeMax: 8.0 }, // HEMOGLOBINA GLICADA (Piora)
  
  // IDs com cmgk2q5t5...
  { examId: "cmgk2q5t50002od86xli4rfls", startValue: 130, changePerExam: 3, fluctuation: 3, rangeMin: 70, rangeMax: 250 }, // GLICOSE PÓS-PRANDIAL (Piora)
  { examId: "cmgk2q5t50003od86gq17o1o5", startValue: 180, changePerExam: 5, fluctuation: 5, rangeMin: 100, rangeMax: 280 }, // COLESTEROL TOTAL (Piora)
  { examId: "cmgk2q5t50004od86mh6fsn9y", startValue: 105, changePerExam: 4, fluctuation: 4, rangeMin: 70, rangeMax: 180 }, // LDL COLESTEROL (Piora)
  { examId: "cmgk2q5t50005od869yvncvjv", startValue: 45, changePerExam: -1, fluctuation: 1, rangeMin: 30, rangeMax: 60 }, // HDL COLESTEROL (Homens) (Piora)
  { examId: "cmgk2q5t50006od86dbl8xaor", startValue: 60, changePerExam: 0, fluctuation: 2, rangeMin: 50, rangeMax: 80 }, // HDL COLESTEROL (Mulheres) (Estável - ignorar para usuário H)
  { examId: "cmgk2q5t50007od86r6q0byeh", startValue: 130, changePerExam: 10, fluctuation: 10, rangeMin: 50, rangeMax: 300 }, // TRIGLICERÍDEOS (Homens) (Piora)
  { examId: "cmgk2q5t50008od867zdpdkps", startValue: 60, changePerExam: 0, fluctuation: 5, rangeMin: 0, rangeMax: 150 }, // TRIGLICERÍDEOS (Crianças) (Estável - ignorar)
  { examId: "cmgk2q5t50009od86a74ycz2h", startValue: 25, changePerExam: 2, fluctuation: 1, rangeMin: 10, rangeMax: 80 }, // TGO (AST) (Piora)
  { examId: "cmgk2q5t5000aod86ro93sc9r", startValue: 30, changePerExam: 3, fluctuation: 1.5, rangeMin: 10, rangeMax: 90 }, // TGP (ALT) (Piora)
  { examId: "cmgk2q5t5000bod863up6hauq", startValue: 35, changePerExam: 4, fluctuation: 2, rangeMin: 10, rangeMax: 100 }, // GAMA GT (Homens) (Piora)
  { examId: "cmgk2q5t5000cod86j6vqmuoj", startValue: 20, changePerExam: 0, fluctuation: 1, rangeMin: 7, rangeMax: 50 }, // GAMA GT (Mulheres) (Estável - ignorar)
  { examId: "cmgk2q5t5000dod86latdssww", startValue: 80, changePerExam: 0, fluctuation: 5, rangeMin: 30, rangeMax: 120 }, // FOSFATASE ALCALINA (Estável)
  { examId: "cmgk2q5t5000eod8660znq362", startValue: 0.9, changePerExam: 0.05, fluctuation: 0.05, rangeMin: 0.7, rangeMax: 1.5 }, // CREATININA (Homens) (Piora leve)
  { examId: "cmgk2q5t5000fod86evsc84gs", startValue: 0.8, changePerExam: 0, fluctuation: 0.05, rangeMin: 0.6, rangeMax: 1.2 }, // CREATININA (Mulheres) (Estável - ignorar)
  { examId: "cmgk2q5t5000god86y5dmrkra", startValue: 35, changePerExam: 0, fluctuation: 3, rangeMin: 15, rangeMax: 60 }, // UREIA (Estável)
  { examId: "cmgk2q5t5000hod86m74eoq5g", startValue: 15, changePerExam: 5, fluctuation: 2, rangeMin: 0, rangeMax: 80 }, // MICROALBUMINÚRIA (Piora)
  { examId: "cmgk2q5t5000iod86xadtz22e", startValue: 10, changePerExam: 1, fluctuation: 0.5, rangeMin: 2, rangeMax: 30 }, // INSULINA JEJUM (Piora)
  { examId: "cmgk2q5t5000jod86s2kpmu4r", startValue: 2.5, changePerExam: 0.2, fluctuation: 0.5, rangeMin: 0.4, rangeMax: 5.0 }, // TSH (Estável)
  { examId: "cmgk2q5t5000kod86123dxhj2", startValue: 1.2, changePerExam: 0, fluctuation: 0.1, rangeMin: 0.8, rangeMax: 1.8 }, // T4 LIVRE (Estável)
  { examId: "cmgk2q5t5000lod86iaciqr35", startValue: 6.0, changePerExam: 0.2, fluctuation: 0.1, rangeMin: 3.5, rangeMax: 8.0 }, // ÁCIDO ÚRICO (Homens) (Piora)
  { examId: "cmgk2q5t5000mod8630qvxsbl", startValue: 4.5, changePerExam: 0, fluctuation: 0.1, rangeMin: 2.5, rangeMax: 7.0 }, // ÁCIDO ÚRICO (Mulheres) (Estável - ignorar)
  { examId: "cmgk2q5t5000nod86thowgqkc", startValue: 0.8, changePerExam: 0.2, fluctuation: 0.1, rangeMin: 0, rangeMax: 4 }, // PCR ULTRASSENSÍVEL (Piora)
  { examId: "cmgk2q5t5000ood86gpql284g", startValue: 2.0, changePerExam: 0.2, fluctuation: 0.1, rangeMin: 0, rangeMax: 5 }, // HOMA-IR (Piora)

  // IDs com cmgk32...
  { examId: "cmgk32bdm0000od977kvfg38o", startValue: 500, changePerExam: -20, fluctuation: 50, rangeMin: 200, rangeMax: 800 }, // TESTOSTERONA TOTAL (Homens) (Piora leve)
  { examId: "cmgk32brt0001od97rfeqlrqj", startValue: 40, changePerExam: 0, fluctuation: 5, rangeMin: 15, rangeMax: 70 }, // TESTOSTERONA TOTAL (Mulheres) (Estável - ignorar)
  { examId: "cmgk32c180002od97va1poofu", startValue: 0.8, changePerExam: 0, fluctuation: 0.1, rangeMin: 0.2, rangeMax: 1.5 }, // 17-HIDROXIPROGESTERONA (Estável)
  { examId: "cmgk32cbr0003od97wrqu6m9e", startValue: 5.0, changePerExam: 0, fluctuation: 2, rangeMin: 0.1, rangeMax: 25 }, // PROGESTERONA (Mulheres) (Estável - ignorar)
  { examId: "cmgk32cmh0004od97o5m6bujd", startValue: 0.5, changePerExam: 0, fluctuation: 0.1, rangeMin: 0.1, rangeMax: 1.1 }, // PROGESTERONA (Homens) (Estável)
  { examId: "cmgk32cwi0005od974e1znqb7", startValue: 150, changePerExam: 0, fluctuation: 50, rangeMin: 30, rangeMax: 450 }, // ESTRADIOL (E2) (Mulheres) (Estável - ignorar)
  { examId: "cmgk32d400006od97judhyv5j", startValue: 30, changePerExam: 2, fluctuation: 3, rangeMin: 10, rangeMax: 60 }, // ESTRADIOL (E2) (Homens) (Piora leve)
  { examId: "cmgk32dfe0007od97yspg9p5h", startValue: 60, changePerExam: -5, fluctuation: 5, rangeMin: 18, rangeMax: 150 }, // SHBG (Piora leve)
  { examId: "cmgk32eau0008od97vj1yfauy", startValue: 400, changePerExam: -20, fluctuation: 30, rangeMin: 180, rangeMax: 1000 }, // DHEA-S (Homens) (Piora leve)
  { examId: "cmgk32ei90009od97wkepydm2", startValue: 200, changePerExam: 0, fluctuation: 20, rangeMin: 35, rangeMax: 430 }, // DHEA-S (Mulheres) (Estável - ignorar)
];

const NUMBER_OF_RECORDS = 8; // 8 exames distribuídos ao longo de 2 anos (a cada ~3 meses)
const TIME_SPAN_DAYS = 730; // 2 anos

async function seedExamData() {
  const allRecords: {
    show: boolean;
    examId: string;
    userId: string;
    value: number;
    notes: string | null;
    lab: string;
    dateExam: string;
  }[] = [];

  const today = new Date();

  for (const exam of EXAMS_TO_SEED) {
    // Para simplificar, excluímos exames específicos de sexo/grupo (Mulheres/Crianças) 
    // se o usuário é provavelmente Homem Adulto (baseado na predominância de H.A. nos dados com tendência à piora).
    if (["cmgk2q5t50006od86dbl8xaor", "cmgk2q5t50008od867zdpdkps", "cmgk2q5t5000cod86j6vqmuoj", "cmgk2q5t5000fod86evsc84gs", "cmgk2q5t5000mod8630qvxsbl", "cmgk32brt0001od97rfeqlrqj", "cmgk32cbr0003od97wrqu6m9e", "cmgk32cwi0005od974e1znqb7", "cmgk32ei90009od97wkepydm2"].includes(exam.examId)) {
        continue;
    }
    
    for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
      // Cálculo da data distribuída + variação de até 30 dias
      const daysBackBase = (TIME_SPAN_DAYS / NUMBER_OF_RECORDS) * (NUMBER_OF_RECORDS - 1 - i);
      const daysBack = daysBackBase + getRandomFloat(0, 30);
      const dateExam = getRandomPastDate(daysBack, today);

      // Aplica a tendência e a flutuação
      const trend = exam.changePerExam * i;
      const noise = getRandomFloat(-exam.fluctuation, exam.fluctuation);
      
      let rawValue = exam.startValue + trend + noise;
      
      // Garante que o valor se mantenha dentro de um limite razoável
      if (rawValue > exam.rangeMax) rawValue = exam.rangeMax;
      if (rawValue < exam.rangeMin) rawValue = exam.rangeMin;
      
      // Arredondamento
      const decimals = exam.fluctuation < 1 ? 2 : 0;
      const finalValue = parseFloat(rawValue.toFixed(decimals));

      allRecords.push({
        show: true,
        examId: exam.examId,
        userId: TARGET_USER_ID,
        value: finalValue,
        notes: `Acompanhamento ${i + 1}/${NUMBER_OF_RECORDS}.`,
        lab: "Laboratório Modelo",
        dateExam: dateExam,
      });
    }
  }

  // Ordena todos os registros por data
  allRecords.sort((a, b) => new Date(a.dateExam).getTime() - new Date(b.dateExam).getTime());

  console.log(`\n--- INICIANDO SEED DE DADOS DE EXAMES ---`);
  console.log(`Total de registros a inserir: ${allRecords.length}`);
  
  // Limpar dados anteriores para evitar chaves duplicadas no histórico
  await db.exam_data.deleteMany({ where: { userId: TARGET_USER_ID } });

  await db.exam_data.createMany({
    data: allRecords,
  });

  console.log("✅ Dados de histórico de 2 anos inseridos com sucesso.");
  console.log("----------------------\n");
}

// --- Execução do Script ---
seedExamData()
  .catch((e) => {
    console.error("❌ Erro ao inserir dados:", e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });