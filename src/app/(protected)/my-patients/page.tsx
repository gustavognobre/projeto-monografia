import React from "react";
import Link from "next/link"; // import do Link
import { getMyPatients } from "@/actions/patient_relation";
import { getUser } from "@/lib/get-user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  gender?: string | null;
  dateBirth?: string | null;
  role?: string | null;
};

function formatGender(gender?: string | null) {
  if (!gender) return "Não informado";
  if (gender.toLowerCase() === "male") return "Masculino";
  if (gender.toLowerCase() === "female") return "Feminino";
  return "Não informado";
}

export default async function Page() {
  const user = await getUser();

  if (!user?.id) {
    return <h1>Usuário não autenticado</h1>;
  }

  const patients = await getMyPatients(user.id);

  if (!patients || patients.length === 0) {
    return <h1>Sem pacientes para esse médico.</h1>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Meus Pacientes</h1>

      {patients.map((patient) => {
        const pUser: User = patient.patientUser || {
          id: patient.id,
          name: "Nome não disponível",
          email: null,
          image: null,
          gender: null,
          dateBirth: null,
          role: null,
        };

        const formattedDateBirth = pUser.dateBirth
          ? new Date(pUser.dateBirth).toLocaleDateString("pt-BR")
          : "Não informado";
          const initials = pUser.name.slice(0, 2).toUpperCase();
        return (
             <Link
      key={pUser.id}
      href={`/my-patients/${pUser.id}`}
      className="group flex items-center gap-6 p-6 border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-md hover:border-primary transition duration-200"
    >
      <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage src={user?.image ?? ""} alt={pUser.name} />
          <AvatarFallback>{initials || "UN"}</AvatarFallback>
        </Avatar>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary mb-1">
          {pUser.name || "Nome não disponível"}
        </h2>

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {pUser.email || "Não informado"}
          </p>
          <p>
            <span className="font-medium text-gray-700">Gênero:</span>{" "}
            {formatGender(pUser.gender)}
          </p>
          <p>
            <span className="font-medium text-gray-700">Nascimento:</span>{" "}
            {formattedDateBirth}
          </p>
        </div>
      </div>
    </Link>
        );
      })}
    </main>
  );
}
