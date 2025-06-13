"use client";
import { UserRole } from "@prisma/client";
import {
    ChartArea,
    FileChartColumn,
    FilePlus,
    FileSymlink,
    Home,
    Settings,
    TableCellsSplit,
    Users,
} from "lucide-react";
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
import { usePathname } from "next/navigation"; 
import { useCurrentRole } from "@/hooks/useAppRequest";
interface RoleGateProps {
    children: React.ReactNode;
    allowedRole?: UserRole; 
}
export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();

    if (allowedRole && role !== allowedRole && role !== UserRole.ADMIN) {
        return null;
    }
    return <>{children}</>; 
};

export function SideBar() {
    const pathname = usePathname(); 

    const menuItems = [
        { icon: Home, label: "Home", link: "/main" },
        { icon: ChartArea, label: "Gráfico", link: "/chart"},
        { icon: Users, label: "Usuário", link: "/client", role: UserRole.ADMIN },
        // { icon: Settings, label: "Configurações", link: "/settings" },
        { icon: TableCellsSplit, label: "Parametros", link: "/parameter", role: UserRole.ADMIN },
        {icon: FilePlus, label: "Adicionar Exame", link: "/new-exam"},
        {icon: FileChartColumn, label: "Meus Exames", link: "/my-exams"},
        {icon: FileSymlink, label: "Adicionar Paciente", link: "/my-patient"},
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
                                    <RoleGate key={item.label} allowedRole={item.role}>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    href={item.link}
                                                    className={`flex items-center gap-2 w-full text-left ${
                                                        pathname === item.link
                                                            ? "bg-blue-500 text-white"
                                                            : "text-gray-800 hover:bg-blue-200"
                                                    }`}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </RoleGate>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
