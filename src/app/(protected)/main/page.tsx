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

export default function HealthAwareness() {
  return (
    <main className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900">
      {/* Hero */}
      <section className="py-20 text-center px-6 md:px-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
          Cuidar da sua Saúde é Prioridade
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-6 animate-fade-in-up delay-100">
          Investir em bem-estar físico e emocional é o caminho para uma vida mais longa, ativa e feliz.
        </p>
        <span className="text-sm text-blue-700 animate-fade-in-up delay-200">
          Fonte: Ministério da Saúde, OMS e instituições de pesquisa médica brasileiras.
        </span>
      </section>

      {/* Blocos informativos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-16 py-10 max-w-7xl mx-auto">
        {[
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
        ].map(({ icon: Icon, title, text }, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4 mb-4 text-blue-700">
              <Icon className="w-8 h-8" />
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <p className="text-sm text-gray-700">{text}</p>
          </div>
        ))}
      </section>

     
<Footer/>
    </main>
  );
}
