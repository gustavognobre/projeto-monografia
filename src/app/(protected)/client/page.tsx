import { UserInfo } from "@/components/main/UserInfo.component";
import { getUser } from "@/lib/get-user";

export default async function ServerPage() {
    const user = await getUser();

    if (!user) {
        return <h1>Usuário não autenticado ou não encontrado</h1>;
    }

    return <UserInfo label="Componente de Servidor" user={user} />;
}
