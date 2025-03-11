"use client";
import { UserInfo } from "@/components/UserInfo.component";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function ClientPage() {
    const user = useCurrentUser();
    return <UserInfo label="Dados do usuário" user={user} />;
}
