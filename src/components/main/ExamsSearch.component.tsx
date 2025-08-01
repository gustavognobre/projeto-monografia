"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  X,
  FolderKanban,
  CalendarDays,
  Info,
  FlaskConical,
  AlertCircle,
  TrendingDown,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { deleteExam_data } from "@/actions/exam_data";

interface Exam {
  id: string;
  name: string;
  group: string;
  normal_min: number | null;
  normal_max: number | null;
  intermediary_min: number | null;
  intermediary_max: number | null;
  hard_value: number | null;
  createdAt: Date;
  updatedAt: Date;
  unit:string;
}

interface UserExam {
  id: string;
  value: number | null;
  notes: string | null;
  dateExam: string | null;
  show: boolean;
  userId: string;
  examId: string;
  createdAt: Date | string | null;
  lab: string;
  exam: Exam;
}

interface MyExamsClientProps {
  exams: UserExam[];
}

const formatDate = (dateInput?: string | Date | null) => {
  if (!dateInput) return "Data não disponível";
  try {
    return format(new Date(dateInput), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "Data inválida";
  }
};

const toISODateString = (dateInput?: string | Date | null): string | undefined => {
  if (!dateInput) return undefined;
  try {
    const dateObj = new Date(dateInput);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString();
    }
  } catch {}
  return undefined;
};

const SearchInput = ({ value, onChange, onClear }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void; }) => (
  <div className="relative max-w-md mx-auto">
    <input
      type="search"
      placeholder="Buscar exame pelo nome..."
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-500"
    />
    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    {value && (
      <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

const getValueStatus = (value: number | null, exam: Exam) => {
  const normalMin = exam.normal_min ?? -Infinity;
  const normalMax = exam.normal_max ?? Infinity;
  const intermediaryMin = exam.intermediary_min ?? -Infinity;
  const intermediaryMax = exam.intermediary_max ?? Infinity;
  const hardValue = exam.hard_value ?? Infinity;

  if (value === null) return { status: "Não Informado", icon: Info, colorClass: "text-gray-700 bg-gray-50 border-gray-200" };
  if (value >= normalMin && value <= normalMax) return { status: "Normal", icon: CheckCircle, colorClass: "text-green-700 bg-green-50 border-green-200" };
  if (value >= intermediaryMin && value <= intermediaryMax) return { status: "Intermediário", icon: AlertCircle, colorClass: "text-yellow-700 bg-yellow-50 border-yellow-200" };
  if (value >= hardValue) return { status: "Crítico", icon: AlertCircle, colorClass: "text-red-700 bg-red-50 border-red-200" };
  if (value < normalMin) return { status: "Abaixo do normal", icon: TrendingDown, colorClass: "text-blue-700 bg-blue-50 border-blue-200" };
  return { status: "Inconclusivo", icon: Info, colorClass: "text-gray-700 bg-gray-50 border-gray-200" };
};

const ExamCard = ({ id, exam, value, notes, dateExam, createdAt, lab, onDelete }: Pick<UserExam, "exam" | "value" | "notes" | "dateExam" | "createdAt" | "lab"> & { id: string; onDelete: (id: string) => void }) => {
  const { status, icon: StatusIcon, colorClass } = getValueStatus(value, exam);
  return (
    <Card tabIndex={0} className="rounded-xl border relative group">
      <CardContent className="p-6 flex flex-col gap-5">
        <header className="flex flex-col gap-2">
          <h3 className="text-2xl font-extrabold text-gray-900 truncate">{exam.name}</h3>
          <span>{lab}</span>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <FlaskConical className="h-5 w-5" />
            <span>{exam.group}</span>
          </div>
        </header>
        <button onClick={() => onDelete(id)} className="absolute top-4 right-4 p-2 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100">
          <Trash2 className="h-5 w-5" />
        </button>
        <section className={`p-4 rounded-lg border flex items-center justify-between ${colorClass}`}>
          <p className="text-lg font-semibold flex items-center gap-2">
            <StatusIcon className="h-6 w-6" />
            Valor: <span className="text-xl font-bold">{value ?? "N/A"}{exam.unit}</span>
          </p>
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white bg-opacity-70 shadow-sm">{status}</span>
        </section>
        <section className="text-sm text-gray-700 space-y-2">
          <strong className="block font-semibold text-gray-800">Valores de Referência</strong>
          <ul className="list-inside pl-4 space-y-1">
            <li>Normal: {exam.normal_min} - {exam.normal_max}</li>
            <li>Intermediário: {exam.intermediary_min} - {exam.intermediary_max}</li>
            <li>Crítico: {exam.hard_value ?? "N/A"}+</li>
          </ul>
        </section>
        <section className="flex items-center gap-2 text-indigo-700 font-semibold text-base">
          <CalendarDays className="h-5 w-5" />
          <time dateTime={toISODateString(dateExam)}>
            Data do exame: {formatDate(dateExam)}
          </time>
        </section>
        {notes && (
          <section className="mt-2 bg-indigo-50 border-l-4 border-indigo-400 rounded-md p-3 flex items-start gap-2 text-indigo-900 text-sm italic shadow-sm">
            <Info className="h-5 w-5" />
            <span>Observações: {notes}</span>
          </section>
        )}
        <footer className="text-xs text-gray-400 text-right mt-auto pt-4 border-t border-gray-100">
          Registrado em: <time dateTime={toISODateString(createdAt)}>{formatDate(createdAt)}</time>
        </footer>
      </CardContent>
    </Card>
  );
};

export const MyExamsClient = ({ exams }: MyExamsClientProps) => {
  const [currentExams, setCurrentExams] = useState<UserExam[]>(exams);
  const [search, setSearch] = useState("");

  const filteredExams = useMemo(() => {
    const term = search.trim().toLowerCase();
    const visibleExams = currentExams.filter((exam) => exam.show);
    return term ? visibleExams.filter(({ exam }) => exam.name.toLowerCase().includes(term)) : visibleExams;
  }, [currentExams, search]);

  const exportToCSV = () => {
    const headers = ["Nome do Exame", "Grupo", "Laboratório", "Valor", "Status", "Notas", "Data do Exame", "Criado em"];
    const rows = filteredExams.map(({ exam, value, notes, dateExam, createdAt, lab }) => {
      const { status } = getValueStatus(value, exam);
      return [exam.name, exam.group, lab, value ?? "N/A", status, notes ?? "Sem observações", formatDate(dateExam), formatDate(createdAt)];
    });
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `exames-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);
  const clearSearch = useCallback(() => setSearch(""), []);

  const handleDelete = useCallback((id: string) => {
    setCurrentExams((prev) => prev.map((exam) => (exam.id === id ? { ...exam, show: false } : exam)));
    deleteExam_data(id);
  }, []);

  return (
    <section className="space-y-10 max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      <SearchInput value={search} onChange={onSearchChange} onClear={clearSearch} />
      <div className="flex justify-end">
        <button onClick={exportToCSV} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Exportar Exames para CSV
        </button>
      </div>
      {filteredExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
          <FolderKanban className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-center">Nenhum exame encontrado para sua busca.</p>
          <p className="text-sm mt-1">Tente um termo diferente ou limpe a busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredExams.map(({ id, exam, value, notes, dateExam, createdAt, lab }) => (
            <ExamCard key={id} id={id} exam={exam} value={value} notes={notes} dateExam={dateExam} createdAt={createdAt} lab={lab} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
};
