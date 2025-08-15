"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
            unit:formData.get("unit") as string, 
        },
    });
    redirect("/parameter");
}

export async function updateExam(formData: FormData, id: string) {
    await db.exam.update({
        where: { id },
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

export async function deleteExam(id: string) {
    await db.exam.delete({ where: { id } });
    revalidatePath("/parameter");
}
