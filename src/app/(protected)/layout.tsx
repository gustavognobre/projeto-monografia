import { SidebarProvider } from "@/components/ui/sidebar";
import { SideBar } from "./_components/sidebar";
import { Header } from "@/components/layout/Header";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <SidebarProvider>
            {" "}
            <div className="min-h-screen w-full flex flex-row  items-start justify-start ">
                <SideBar />
                <div className="w-full ">
                    <Header />
                    <div className="flex-grow">
                        {" "}
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default ProtectedLayout;
