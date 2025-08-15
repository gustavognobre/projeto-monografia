import { currentUser } from "./auth";
import { db } from "./db";

export async function getPatient() {
  const thisUser = await currentUser();
  if (!thisUser) return null;

  const exams = await db.patient.findMany({
    where: {
      medicalId: thisUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return exams;
}

export async function existPatient(idPatient:string){
  const exist = await db.user.findFirst({
    where:{
      id:idPatient
    }
  })
  return exist
}