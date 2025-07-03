// exam_data.ts (server action)
"use server";

import { db } from "@/lib/db";

function toNullableNumber(value: FormDataEntryValue | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

function toBoolean(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

export async function createExam_data(formData: FormData) {
  await db.exam_data.create({
    data: {
      createdAt: new Date(),
      show: toBoolean(formData.get("show")),
      examId: formData.get("examId") as string,
      userId: formData.get("userId") as string,
      value: toNullableNumber(formData.get("value")),
      notes: formData.get("notes") as string,
      lab: formData.get("lab") as string,
      dateExam: formData.get("dateExam") as string,
    },
  });
}

export async function deleteExam_data(id: string) {
  try {
    await db.exam_data.update({
      where: {
        id: id, // O ID do registro a ser atualizado
      },
      data: {
        show: false, // Define a propriedade 'show' como false para o soft delete
      },
    });
    console.log(`Registro de exame com ID ${id} foi marcado como inativo (soft delete).`);
  } catch (error) {
    console.error(`Erro ao realizar soft delete no registro de exame ${id}:`, error);
    // Você pode querer relançar o erro ou retornar um status de falha
    throw new Error("Falha ao realizar soft delete no registro de exame.");
  }
}


export async function createAnthropometry(formData: FormData) {
  await db.anthropometry.create({
    data: {
      createdAt: new Date(),
      show: formData.get("show") === "true",
      userId: formData.get("userId") as string,
      height: toNullableNumber(formData.get("height")),
      weight: toNullableNumber(formData.get("weight")),
      chest: toNullableNumber(formData.get("chest")),
      shoulder: toNullableNumber(formData.get("shoulder")),
      rightArm: toNullableNumber(formData.get("rightArm")),
      leftArm: toNullableNumber(formData.get("leftArm")),
      waist: toNullableNumber(formData.get("waist")),
      rightLeg: toNullableNumber(formData.get("rightLeg")),
      leftLeg: toNullableNumber(formData.get("leftLeg")),
      rightCalf: toNullableNumber(formData.get("rightCalf")),
      leftCalf: toNullableNumber(formData.get("leftCalf")),
      notes: formData.get("notes") as string | null,
      dateExam: formData.get("dateExam") as string | null,
    },
  });
}
