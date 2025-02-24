import { LogoMetabolic } from "@/assets/illustration/LogoMetabolic.illustration";
import React from "react";

interface HeaderLoginProps {
    label: string;
    headerText?: string;
}

export const Header = ({ label, headerText }: HeaderLoginProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center mt-4">
            {/* Logo e Nome do Site */}
            <div className="flex items-center space-x-2 mb-4">
                <LogoMetabolic />
            </div>

            {/* Título do header */}
            <p className="text-xl font-montserrat font-semibold text-red-600">{label}</p>
            <p className=" text-muted-foreground text-sm">{headerText}</p>
        </div>
    );
};
