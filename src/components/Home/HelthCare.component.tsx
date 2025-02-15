import { MobilePhone } from "@/assets/illustration/MobilePhone.illustration";
import React from "react";
import { Button } from "../ui/button";

export function HelthCare() {
    return (
        <div className="w-full h-full px-6 md:px-16 lg:px-24 py-16 flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
            {/* Imagem do celular */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
                <MobilePhone />
            </div>

            {/* Texto e botão de ação */}
            <div className="flex flex-col justify-start items-start gap-6 text-center lg:text-left">
                <div className="w-full flex flex-col justify-start items-start gap-3">
                    {/* Títulos */}
                    <span className="text-neutral-600 text-3xl md:text-4xl lg:text-5xl font-semibold font-montserrat leading-tight">
                        Acessibilidade ao Cuidado
                    </span>
                    <span className="text-blue-600 text-3xl md:text-4xl lg:text-5xl font-semibold font-montserrat leading-tight">
                        Informação e Suporte para Todos
                    </span>
                </div>

                {/* Descrição */}
                <div className="text-neutral-500 text-sm md:text-base font-normal font-montserrat leading-relaxed">
                    A saúde é o bem mais precioso, e conhecer o que está acontecendo com seu corpo é
                    o primeiro passo para cuidar de si com eficácia. Com fácil acesso a informações
                    sobre sintomas, hábitos saudáveis e monitoramento de condições como obesidade e
                    síndrome metabólica, você pode tomar decisões informadas, promover a prevenção e
                    detectar problemas de saúde precocemente.
                </div>

                {/* Botão de ação */}
                <a
                    href="https://www.scielo.br/j/abc/a/qWzJH647dkF7H5dML8x8Nym/?lang=pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-center lg:self-start"
                >
                    <Button
                        variant={"link"}
                        className="font-montserrat bg-blue-600 text-white h-12 md:h-14 w-auto py-2 md:py-4 px-8 md:px-10 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                        Saiba Mais
                    </Button>
                </a>
            </div>
        </div>
    );
}
