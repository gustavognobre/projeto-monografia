import { useCurrentUser } from "@/hooks/useAppRequest";

export default function UsersPage() {
    const user = useCurrentUser();
    return (
        <div className="flex flex-col h-full w-[100%]">
            <main className="flex-grow p-6">
                <h2 className="text-lg font-semibold">Dados do usuário</h2>
                {JSON.stringify(user, null, 2)}
            </main>
        </div>
    );
}
