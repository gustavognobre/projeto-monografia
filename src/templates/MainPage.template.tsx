import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface IMainPage {
    user: any;
    session: any;
}

export default async function MainPage({ user, session }: IMainPage) {
    return (
        <SidebarProvider>
            <AppSidebar user={user} session={session} />
        </SidebarProvider>
    );
}
