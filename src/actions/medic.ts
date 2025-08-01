"use server";

import { db } from "@/lib/db";
import { TipoInscricao, Situacao } from "@prisma/client";

export async function createMedico(formData: FormData) {
  const tipo = formData.get("tipo") as string | null;
  const situacao = formData.get("situacao") as string | null;
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email obrigatório para atualizar o usuário");
  }

  const tipoEnum = tipo ? TipoInscricao[tipo as keyof typeof TipoInscricao] : null;
  const situacaoEnum = situacao ? Situacao[situacao as keyof typeof Situacao] : null;

  // Cria o médico
  await db.medico.create({
    data: {
      nome: formData.get("nome") as string,
      email,
      crm: formData.get("crm") as string,
      tipo: tipoEnum,
      situacao: situacaoEnum,
      especialidade: formData.get("especialidade") as string | null,
      area: formData.get("area") as string | null,
      uf: formData.get("uf") as string,
    },
  });

  // Atualiza o usuário para role 'medic'
  await db.user.update({
    where: { email },
    data: { role: "MEDIC" },
  });
}


export async function getMedicoByCrm(crm: string, uf: string) {
  if (!crm || !uf) return null;

  try {
    const medico = await db.medico.findUnique({
      where: {
        crm_uf: {
          crm,
          uf,
        },
      },
    });

    if (!medico) return null;

    // Buscar usuário vinculado pelo email do médico
    const user = medico.email
      ? await db.user.findUnique({
          where: { email: medico.email },
        })
      : null;

    return { medico, user };
  } catch (error) {
    console.error("Erro ao buscar médico:", error);
    return null;
  }
}