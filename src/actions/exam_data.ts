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
      dateExam: formData.get("dateExam") as string,
    },
  });
}
