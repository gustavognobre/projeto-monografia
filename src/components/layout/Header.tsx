"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { logout } from "@/actions/logout";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useAppRequest";

export function Header() {
    const user = useCurrentUser();

    const handleSignOut = async () => {
        await logout();
    };

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-white px-6">
            {/* Área esquerda do header - adicione seu logo ou título aqui */}

            {/* Área central - pode adicionar navegação ou outro conteúdo aqui */}
            <div className="flex-grow mx-4">{/* Conteúdo central opcional */}</div>

            {/* Área direita com perfil do usuário */}
            <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-sm font-medium">{user?.name ?? "Usuário"}</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage
                                src={user?.image ?? "/placeholder.svg?height=40&width=40"}
                                alt="User Avatar"
                            />
                            <AvatarFallback>{user?.name?.charAt(0) ?? "?"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user?.name ?? "Usuário"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="flex items-center text-red-700 cursor-pointer"
                        >
                            Sair
                            <DropdownMenuShortcut>
                                <LogOut className="ml-2 w-4 h-4 text-red-700" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <Link href="/settings">
                            <DropdownMenuItem className="flex items-center  cursor-pointer">
                                Configurações
                                <DropdownMenuShortcut>
                                    <Settings className="ml-2 w-4 h-4 " />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>{" "}
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
