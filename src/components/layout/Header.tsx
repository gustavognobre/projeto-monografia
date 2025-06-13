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

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useCurrentUser();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-white px-4 shadow-sm">
      {/* Botão hamburguer - visível no mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 mr-2 rounded-md hover:bg-gray-100 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Espaço central */}
      <div className="flex-grow">{/* Título ou navegação aqui se quiser */}</div>

      {/* Perfil */}
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
              <DropdownMenuItem className="flex items-center cursor-pointer">
                Configurações
                <DropdownMenuShortcut>
                  <Settings className="ml-2 w-4 h-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
