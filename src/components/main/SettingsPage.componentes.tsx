import { db } from "@/lib/db";
import { getUser } from "@/lib/get-user";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Mail, Calendar, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettingsPage = async () => {
    const sessionUser = await getUser();

    if (!sessionUser) {
        return <div className="text-center pt-24">Usuário não autenticado</div>;
    }

    const user = await db.user.findUnique({
        where: { id: sessionUser.id },
    });

    if (!user) {
        return <div className="text-center pt-24">Usuário não encontrado</div>;
    }

    return (
    <section className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Configurações da Conta</h2>
        <main className="flex flex-col items-center pt-24 px-4">
            <Card className="w-full max-w-7xl mx-auto border-0 bg-transparent shadow-none">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20 border-2 border-primary/20">
                                <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name || "Usuário"} />
                                <AvatarFallback>
                                    {user.name?.substring(0, 2).toUpperCase() || "UN"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl font-bold">{user.name || "Usuário"}</CardTitle>
                                <CardDescription>Informações da conta</CardDescription>
                            </div>
                        </div>
                        <Badge variant={user.isTwoFactorEnabled ? "default" : "outline"}>
                            {user.isTwoFactorEnabled ? "2FA Ativado" : "2FA Desativado"}
                        </Badge>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <form className="space-y-4">
                        {/* Nome */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={user.name || ""}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* E-mail */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={user.email || ""}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Gênero */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700">Gênero</label>
                                <select
                                    name="gender"
                                    defaultValue={user.gender || ""}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Selecione</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>
                        </div>

                        {/* Data de Nascimento */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                                <input
                                    name="dateBirth"
                                    type="date"
                                    defaultValue={
                                        user.dateBirth
                                            ? new Date(user.dateBirth).toISOString().split("T")[0]
                                            : ""
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Imagem */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full">
                                <label className="text-sm font-medium text-gray-700">Imagem (URL)</label>
                                <input
                                    name="image"
                                    type="url"
                                    defaultValue={user.image || ""}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Autenticação de 2 Fatores */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full flex items-center space-x-2">
                                <input
                                    name="isTwoFactorEnabled"
                                    type="checkbox"
                                    defaultChecked={user.isTwoFactorEnabled}
                                    className="h-4 w-4 border-gray-300 rounded"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Autenticação de 2 Fatores ativada
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="w-full max-w-xs bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
        </section>
    );
};

export default SettingsPage;
