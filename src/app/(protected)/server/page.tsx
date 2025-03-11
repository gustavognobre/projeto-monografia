import { UserInfo } from "@/components/UserInfo.component";
import { currentUser } from "@/lib/auth";

export default async function ServerPage() {
    const user = await currentUser();
    return <UserInfo label="Componente de Servidor" user={user} />;
}
