import { LogoMetabolic } from "@/assets/illustration/LogoMetabolic.illustration";
import Link from "next/link";
import React from "react";

interface HeaderLoginProps {
    label: string;
    headerText?: string;
}

export const HeaderLogin = ({ label, headerText }: HeaderLoginProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center mt-4">
            {/* Logo e Nome do Site */}
            <div className="flex items-center space-x-2 mb-4">
                <LogoMetabolic />
                <Link
                    href="/"
                    className="text-2xl font-bold text-blue-600 font-montserrat"
                    aria-label="Ir para a página inicial"
                >
                    MetabolicHub
                </Link>
            </div>

            {/* Título do header */}
            <p className="text-3xl font-montserrat font-semibold text-blue-600">{label}</p>
            <p className=" text-muted-foreground text-sm">{headerText}</p>
        </div>
    );
};
