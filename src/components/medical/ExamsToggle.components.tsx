"use client";

import React, { useState } from "react";
import ClientExamSearch from "../main/ClientExamSearch.component";
import ExamsTable from "../main/ExamTable.component";
import { MyExamsClient } from "../main/ExamsSearch.component";


interface ExamsToggleProps {
  exams: any[];
  examsWithData: any[];
}

enum Panel {
  None,
  Exams,
  Charts,
  Table,
}

export function ExamsToggle({ exams, examsWithData }: ExamsToggleProps) {
  const [openPanel, setOpenPanel] = useState<Panel>(Panel.None);

  const togglePanel = (panel: Panel) => {
    setOpenPanel(openPanel === panel ? Panel.None : panel);
  };

  const getButtonStyle = (active: boolean) =>
    `px-4 py-2 rounded-xl shadow-sm transition-all duration-150 font-medium
     ${active ? "bg-primary text-white" : "bg-primary/90 text-white hover:bg-primary"}
    `;

  return (
    <div className="space-y-4">
      {/* Botões */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => togglePanel(Panel.Exams)}
          className={getButtonStyle(openPanel === Panel.Exams)}
          type="button"
        >
          {openPanel === Panel.Exams ? "Fechar exames" : "Mostrar exames"}
        </button>

        <button
          onClick={() => togglePanel(Panel.Charts)}
          className={getButtonStyle(openPanel === Panel.Charts)}
          type="button"
        >
          {openPanel === Panel.Charts ? "Fechar gráficos" : "Mostrar gráficos"}
        </button>

        <button
          onClick={() => togglePanel(Panel.Table)}
          className={getButtonStyle(openPanel === Panel.Table)}
          type="button"
        >
          {openPanel === Panel.Table ? "Fechar tabela" : "Mostrar tabela"}
        </button>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="rounded-2xl shadow-md border border-zinc-200 p-4 bg-white">
        {openPanel === Panel.Exams && <MyExamsClient exams={exams} />}
        {openPanel === Panel.Charts && <ClientExamSearch exams={examsWithData} />}
        {openPanel === Panel.Table && <ExamsTable exams={examsWithData} />}
      </div>
    </div>
  );
}
