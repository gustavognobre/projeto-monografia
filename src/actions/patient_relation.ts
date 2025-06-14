'use server';
import { db } from "@/lib/db";

export async function createPatient(formData: FormData) {
  const medicalId = formData.get("medicalId");
  const patientId = formData.get("patientId");

  if (!medicalId || !patientId) {
    throw new Error("Dados obrigatórios ausentes");
  }

  await db.patient.create({
    data: {
      createdAt: new Date(),
      medicalId: medicalId.toString(),
      patientId: patientId.toString(),
    },
  });
}

export async function checkPatientExistsOnServer(patientId: string): Promise<boolean> {
  try {
    const patient = await db.user.findFirst({
      where: { id: patientId }
    });
    return !!patient;
  } catch (error) {
    console.error("Erro ao verificar paciente no servidor:", error);
    return false;
  }
}

export async function getMyPatients(userId: string) {
  if (!userId) return [];

  return await db.patient.findMany({
    where: {
      OR: [
        { medicalId: userId },
        { patientId: userId },
      ]
    },
    include: {
      medicalUser: true,
      patientUser: true,
    }
  });
}