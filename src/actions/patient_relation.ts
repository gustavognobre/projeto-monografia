'use server';
import { db } from "@/lib/db";

export async function createPatient(medicalId: string, patientId: string) {
  if (!medicalId || !patientId) {
    throw new Error("Dados obrigatórios ausentes");
  }

  // Verifica se já existe a relação
  const existingRelation = await db.patient.findFirst({
    where: {
      medicalId,
      patientId,
    },
  });

  if (existingRelation) {
    // Relação já existe, não cria duplicado
    return { message: "Relação já existe", created: false };
  }

  // Cria a relação se não existir
  await db.patient.create({
    data: {
      createdAt: new Date(),
      medicalId,
      patientId,
    },
  });

  return { message: "Relação criada com sucesso", created: true };
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
      ]
    },
    include: {
      medicalUser: true,
      patientUser: true,
    }
  });
}

export async function getMyDoctors(patientId: string) {
  if (!patientId) return [];

  const relations = await db.patient.findMany({
    where: {
      patientId,
    },
    include: {
      medicalUser: true, // dados do user (nome, email, etc.)
    },
  });

  const doctors = await Promise.all(
    relations.map(async (relation) => {
      const medicoInfo = await db.medico.findUnique({
        where: {
          email: relation.medicalUser.email ?? "",
        },
      });

      return {
        id: relation.medicalUser.id,
        nomeUsuario: relation.medicalUser.name,
        email: relation.medicalUser.email,
        medicoId: medicoInfo?.id,
        nome: medicoInfo?.nome,
        crm: medicoInfo?.crm,
        uf: medicoInfo?.uf,
        tipo: medicoInfo?.tipo,
        situacao: medicoInfo?.situacao,
        especialidade: medicoInfo?.especialidade,
        area: medicoInfo?.area,
        criadoEm: medicoInfo?.criadoEm,
      };
    })
  );

  return doctors;
}


