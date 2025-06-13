"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem,
  TooltipModel,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExamChartProps {
  examInfo: {
    name?: string | null;
    normal_min?: number | null;
    normal_max?: number | null;
    intermediary_min?: number | null;
    intermediary_max?: number | null;
    hard_value?: number | null;
  };
  examData: {
    id: string;
    value: number | null;
    dateExam?: string | null;
  }[];
}

export function ExamChart({ examInfo, examData }: ExamChartProps) {
  const examName = examInfo.name
    ? examInfo.name.charAt(0).toUpperCase() + examInfo.name.slice(1).toLowerCase()
    : "Exame";

  const sortedData = examData
    .filter((d) => d.value !== null && d.dateExam)
    .sort((a, b) => new Date(a.dateExam!).getTime() - new Date(b.dateExam!).getTime());

  const labels = sortedData.map((d) => new Date(d.dateExam!).toLocaleDateString());
  const userValues = sortedData.map((d) => d.value!);

  const { normal_min, normal_max, intermediary_min, intermediary_max, hard_value } = examInfo;

  const normalMinLine = labels.map(() => normal_min ?? NaN);
  const normalMaxLine = labels.map(() => normal_max ?? NaN);
  const intermediaryMinLine = labels.map(() => intermediary_min ?? NaN);
  const intermediaryMaxLine = labels.map(() => intermediary_max ?? NaN);
  const criticalBaseLine = labels.map(() => hard_value ?? NaN);
  const criticalTopLine = labels.map(() => (hard_value ? hard_value * 2 : NaN));

  const data = {
    labels,
    datasets: [
      {
        label: "Valor do Usuário",
        data: userValues,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.4,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
        order: 4,
      },
      {
        label: "Normal (Área)",
        data: normalMaxLine,
        borderColor: "transparent",
        backgroundColor: "rgba(16,185,129,0.3)",
        fill: "+1",
        pointRadius: 0,
        order: 1,
      },
      {
        label: "Normal (Área Inferior)",
        data: normalMinLine,
        borderColor: "transparent",
        backgroundColor: "transparent",
        fill: false,
        pointRadius: 0,
        order: 2,
      },
      {
        label: "Atenção (Área)",
        data: intermediaryMaxLine,
        borderColor: "transparent",
        backgroundColor: "rgba(245,158,11,0.3)",
        fill: "+1",
        pointRadius: 0,
        order: 1,
      },
      {
        label: "Atenção (Área Inferior)",
        data: intermediaryMinLine,
        borderColor: "transparent",
        backgroundColor: "transparent",
        fill: false,
        pointRadius: 0,
        order: 2,
      },
      {
        label: "Crítico (Área)",
        data: criticalTopLine,
        borderColor: "transparent",
        backgroundColor: "rgba(239,68,68,0.3)",
        fill: "+1",
        pointRadius: 0,
        order: 1,
      },
      {
        label: "Crítico (Área Inferior)",
        data: criticalBaseLine,
        borderColor: "transparent",
        backgroundColor: "transparent",
        fill: false,
        pointRadius: 0,
        order: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: `Evolução dos Resultados do ${examName}`,
        font: {
          size: 20,
          weight: 600, // number, não string
        },
      },
      tooltip: {
        mode: "nearest",
        intersect: true,
        callbacks: {
          label: (context: TooltipItem<"line">) => context.parsed.y?.toString() ?? "",
        },
      },
    },
    scales: {
      y: { beginAtZero: false },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 12 },
        },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: true,
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="w-full h-[320px] md:h-[400px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
