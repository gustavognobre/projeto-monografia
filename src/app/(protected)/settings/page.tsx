"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function SettingsPage() {
    const user = useCurrentUser();

    const onClick = () => {
        logout();
    };

    return (
        <div className="flex flex-col min-h-screen w-full px-5">
            {/* Exibe o JSON com os dados do usuário */}
            <div className="mb-4">{JSON.stringify(user)}</div>

            {/* Botão de logout */}
            <button
                type="submit"
                onClick={onClick}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Sign Out
            </button>
        </div>
    );
}
