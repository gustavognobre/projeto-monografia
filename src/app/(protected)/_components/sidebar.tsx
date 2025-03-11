"use client";

import { Home, LayoutDashboard, Server, Settings, UserCog, Users } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname no lugar de useRouter

export function SideBar() {
    const pathname = usePathname(); // Hook para pegar o pathname da URL atual

    const menuItems = [
        { icon: Home, label: "Home", link: "/main" },
        { icon: LayoutDashboard, label: "Painel", link: "/dashboard" },
        { icon: Users, label: "Usuário", link: "/client" },
        { icon: Settings, label: "Configurações", link: "/settings" },
        { icon: UserCog, label: "Administrador", link: "/admin" },
        { icon: Server, label: "Servidor", link: "/server" },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.link}
                                                className={`flex items-center gap-2 w-full text-left ${
                                                    pathname === item.link
                                                        ? "bg-blue-500 text-white" // Aplica o destaque quando a rota corresponder
                                                        : "text-gray-800 hover:bg-blue-200"
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
