'use server';
import { db } from "@/lib/db";

function toNullableNumber(value: FormDataEntryValue | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export async function createExam(formData: FormData) {
  await db.exam.create({
    data: {
      name: formData.get("name") as string,
      group: formData.get("group") as string,
      normal_min: toNullableNumber(formData.get("normal_min")),
      normal_max: toNullableNumber(formData.get("normal_max")),
      intermediary_min: toNullableNumber(formData.get("intermediary_min")),
      intermediary_max: toNullableNumber(formData.get("intermediary_max")),
      hard_value: toNullableNumber(formData.get("hard_value")),
    },
  });
}
