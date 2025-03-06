"use client";

import { useState } from "react";
import { Home, LayoutDashboard, Settings, Users } from "lucide-react";

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
import { Header } from "./Header";
import UsersPage from "../main/UserPage.component";

interface ISideBar {
    user: any;
    session: any;
}

// Componente Header

// Componentes das páginas
const HomePage = () => <div>🏠 Página Inicial</div>;
const DashboardPage = () => <div>📊 Dashboard</div>;
const SettingsPage = () => <div>⚙️ Configurações</div>;

// Estrutura do menu

export function AppSidebar({ user, session }: ISideBar) {
    const menuItems = [
        { icon: Home, label: "Home", component: <HomePage /> },
        { icon: LayoutDashboard, label: "Dashboard", component: <DashboardPage /> },
        { icon: Users, label: "Users", component: <UsersPage user={user} session={session} /> },
        { icon: Settings, label: "Settings", component: <SettingsPage /> },
    ];
    const [activeComponent, setActiveComponent] = useState(<HomePage />); // Estado inicial
    return (
        <div className="flex h-screen">
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
                                            <button
                                                onClick={() => setActiveComponent(item.component)}
                                                className="flex items-center gap-2 w-full text-left"
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            {/* Área de Conteúdo com Header */}
            <div className="flex flex-col flex-grow">
                <Header user={user} session={session} />
                <div className="flex-grow p-4">{activeComponent}</div>
            </div>
        </div>
    );
}
