"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { MedicalCare } from "@/assets/illustration/MedicalCare.illustration";

export function Hero() {
    const router = useRouter();
    const handleClick = () => {
        router.push("/auth/login");
    };
    return (
        <div className="w-full h-full px-6 md:px-16 lg:px-24 py-16 bg-gradient-to-l from-slate-200 to-slate-50 flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
            <div className="flex flex-col justify-start items-start gap-6 text-center lg:text-left">
                <div className="w-full flex flex-col justify-start items-start gap-3">
                    <div className="w-full">
                        <span className="text-neutral-600 text-4xl md:text-5xl lg:text-6xl font-semibold font-montserrat leading-tight mb-4">
                            Transformando Vidas
                        </span>
                        <br />
                        <span className="text-blue-600 text-4xl md:text-5xl lg:text-6xl font-semibold font-montserrat leading-tight">
                            Saúde e bem-estar constantes
                        </span>
                    </div>
                    <div className="w-full text-neutral-500 text-sm md:text-base font-normal font-montserrat leading-relaxed">
                        Tratamentos especializados para obesidade e síndrome metabólica, com
                        acompanhamento personalizado e suporte contínuo para sua saúde.
                    </div>
                </div>

                {/* Botão de Ação */}
                <Button
                    onClick={handleClick}
                    className="font-montserrat bg-blue-600 text-white h-12 md:h-14 w-auto py-4 px-8 md:px-10 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    Quero Começar
                </Button>
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center mt-8 lg:mt-0">
                <MedicalCare />
            </div>
        </div>
    );
}
