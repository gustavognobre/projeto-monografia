"use client";

import { Footer } from "@/components/Home/Footer.component";
import {
  HeartPulse,
  Stethoscope,
  CalendarCheck2,
  Brain,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TermsOfUseDialog from "../im-medic/page";
import { cn } from "@/lib/utils"; // caso use utilitário de classnames do shadcn

export default function HealthAwareness() {
  const infos = [
    {
      icon: HeartPulse,
      title: "Prevenção é essencial",
      text: "Exames de rotina e hábitos saudáveis reduzem em até 80% o risco de doenças crônicas como diabetes e hipertensão.",
    },
    {
      icon: Stethoscope,
      title: "Acompanhamento médico contínuo",
      text: "Consultas regulares auxiliam no diagnóstico precoce e no controle eficaz de doenças, evitando complicações graves.",
    },
    {
      icon: CalendarCheck2,
      title: "Rotina saudável",
      text: "Estabelecer uma rotina de cuidados médicos ajuda a manter o equilíbrio físico, mental e social.",
    },
    {
      icon: Brain,
      title: "Saúde mental importa",
      text: "Transtornos como ansiedade e depressão afetam milhões de brasileiros. Cuidar da mente é tão importante quanto do corpo.",
    },
    {
      icon: ShieldCheck,
      title: "Imunidade fortalecida",
      text: "Boa alimentação, sono adequado e vacinas em dia mantêm o corpo protegido contra infecções e doenças sazonais.",
    },
    {
      icon: Users,
      title: "Impacto coletivo",
      text: "Pessoas saudáveis geram menos custos para o sistema de saúde, promovem ambientes familiares e profissionais mais equilibrados.",
    },
  ];

  return (
    <main className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900">
      {/* HERO */}
      <section className="py-20 text-center px-6 md:px-16 animate-in fade-in-50">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">
          Cuidar da sua Saúde é Prioridade
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mb-4">
          Investir em bem-estar físico e emocional é o caminho para uma vida mais longa, ativa e feliz.
        </p>
        <span className="text-sm text-blue-800 font-medium">
          Fonte: Ministério da Saúde, OMS e instituições de pesquisa médica brasileiras.
        </span>

        <div className="mt-6">
          <TermsOfUseDialog />
        </div>
      </section>

      {/* BLOCOS INFORMATIVOS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-16 py-10 max-w-7xl mx-auto">
        {infos.map(({ icon: Icon, title, text }, i) => (
          <Card
            key={i}
            className="transition-transform hover:scale-[1.02] hover:ring-2 hover:ring-primary/30 bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-primary mb-3">
                <Icon className="w-7 h-7" />
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Footer />
    </main>
  );
}
