import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuShortcut,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface IHeader {
    user: any;
    session: any;
}

export function Header({ user, session }: IHeader) {
    console.log(session.user);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-6">
            <div className="flex items-center space-x-4 ml-auto">
                <span className="text-sm font-medium">{user?.name ?? "Usuário"}</span>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage
                                src={user?.image ?? "/path/to/default/avatar.jpg"}
                                alt="User Avatar"
                            />
                            <AvatarFallback>{user?.name?.charAt(0) ?? "?"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{user?.name ?? "Usuário"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="flex items-center text-red-700"
                        >
                            Sair
                            <DropdownMenuShortcut>
                                <LogOut className="ml-2 w-4 h-4 text-red-700" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
