"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Interface corrigida para aceitar null e undefined
interface ExtendedUser {
  name?: string | null;
  gender?: string | null;
  dateBirth?: string | null;
  image?: string | null;
}

interface IUserInfoProps {
  user?: ExtendedUser;
}

// Função para calcular idade com fallback
const calculateAge = (dateBirth?: string | null): string => {
  if (!dateBirth) return "N/A";
  const birthDate = new Date(dateBirth);
  if (isNaN(birthDate.getTime())) return "Data inválida";
  const ageDiff = new Date().getTime() - birthDate.getTime();
  const age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  return `${dateBirth} (${age} anos)`;
};

// Função para formatar o gênero
const formatGender = (gender?: string | null): string => {
  if (!gender) return "N/A";
  const lowerGender = gender.toLowerCase();
  if (lowerGender === "male") return "Masculino";
  if (lowerGender === "female") return "Feminino";
  return gender;
};

export const UserInfo = ({ user }: IUserInfoProps) => {
  const name = user?.name ?? "Usuário";
  const initials = name.slice(0, 2).toUpperCase();

  const infoItems = [
    { label: "Nome", value: name, icon: User },
    { label: "Sexo", value: formatGender(user?.gender), icon: UserCircle },
    { label: "Data de Nascimento", value: calculateAge(user?.dateBirth), icon: Calendar },
  ];

  return (
    <Card className="max-w-4xl mx-auto bg-transparent shadow-none border-0">
      <CardHeader className="pb-4 flex items-center gap-6">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage src={user?.image ?? ""} alt={name} />
          <AvatarFallback>{initials || "UN"}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <CardDescription className="text-center items-center justify-center">
            Hub de Análises
          </CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {infoItems.map(({ label, value, icon: Icon }, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex justify-center items-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Página de exemplo para testes
export default function UserInfoPage() {
  const exampleUser: ExtendedUser = {
    name: "João Silva",
    gender: "male", // Valor original vindo em inglês
    dateBirth: "1990-05-15",
    image: "https://github.com/shadcn.png",
  };

  return (
    <div className="container px-6 py-10 mx-auto max-w-7xl">
      <UserInfo user={exampleUser} />
    </div>
  );
}
