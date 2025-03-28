"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Briefcase, Calendar, Shield, UserCircle, Fingerprint } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExtendedUser {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    gender?: string;
    dateBirth?: string;
    isTwoFactorEnabled?: boolean;
    image?: string;
}

interface IUserInfoProps {
    user?: ExtendedUser;
}

const calculateAge = (dateBirth?: string): string => {
    if (!dateBirth) return "N/A";
    const birthDate = new Date(dateBirth);
    if (isNaN(birthDate.getTime())) return "Data inválida";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return `${dateBirth} (${age} anos)`;
};

export const UserInfo = ({ user }: IUserInfoProps) => {
    return (
        <Card className="w-full max-w-7xl mx-auto border-0 bg-transparent shadow-none">
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-primary/20">
                            <AvatarImage src={user?.image} alt={user?.name || "Usuário"} />
                            <AvatarFallback>
                                {user?.name?.substring(0, 2).toUpperCase() || "UN"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">{user?.name || "Usuário"}</CardTitle>
                            <CardDescription>Informações do perfil</CardDescription>
                        </div>
                    </div>
                    <Badge variant={user?.isTwoFactorEnabled ? "default" : "outline"}>
                        {user?.isTwoFactorEnabled ? "2FA Ativado" : "2FA Desativado"}
                    </Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[
                        { label: "ID", value: user?.id, icon: Fingerprint },
                        { label: "Nome", value: user?.name, icon: User },
                        { label: "E-mail", value: user?.email, icon: Mail },
                        { label: "Cargo", value: user?.role, icon: Briefcase },
                        { label: "Sexo", value: user?.gender, icon: UserCircle },
                        { label: "Data de Nascimento", value: calculateAge(user?.dateBirth), icon: Calendar },
                        { label: "Segurança", value: user?.isTwoFactorEnabled ? "Ativada" : "Desativada", icon: Shield },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="font-medium">{item.value || "N/A"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default function UserInfoPage() {
    const exampleUser = {
        id: "usr_123456789",
        name: "João Silva",
        email: "joao.silva@exemplo.com",
        role: "Administrador",
        gender: "Masculino",
        dateBirth: "1990-05-15",
        isTwoFactorEnabled: true,
        image: "https://github.com/shadcn.png",
    };
    return (
        <div className="container px-6 py-10 mx-auto max-w-7xl">
            <UserInfo user={exampleUser} />
        </div>
    );
}
