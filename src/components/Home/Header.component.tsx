"use client";

import { LogoMetabolic } from "@/assets/illustration/LogoMetabolic.illustration";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function HomeHeader() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/auth/login");
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-6 md:px-12 lg:px-24 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                <div className="flex items-center space-x-2">
                    <LogoMetabolic />
                    <Link
                        href="/"
                        className="text-2xl font-bold text-blue-600 font-montserrat"
                        aria-label="Ir para a página inicial"
                    >
                        MetabolicHub
                    </Link>
                </div>
                {/* Links de Navegação */}
                <nav className="hidden md:flex space-x-6">
                    <Link
                        href="#features"
                        className="text-gray-700 hover:text-blue-600 transition duration-300 font-montserrat"
                        aria-label="Funcionalidades"
                    >
                        Funcionalidades
                    </Link>
                </nav>
                <Button
                    onClick={handleClick}
                    className="font-montserrat bg-blue-600 text-white h-12 w-auto py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    Quero Começar
                </Button>
            </div>
        </header>
    );
}
