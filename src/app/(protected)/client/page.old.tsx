"use client";
import { UserInfo } from "@/components/main/UserInfo.component";
import { useCurrentUser } from "@/hooks/useAppRequest";

export default function ClientPage() {
    const user = useCurrentUser();
    return <UserInfo label="Dados do usuário" user={user} />;
}
