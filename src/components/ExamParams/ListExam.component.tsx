"use client";

import { useState, useMemo } from "react";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteExam } from "@/actions/exams";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import AddExamForm from "@/modal/AddPrams.component";
import ExamDetailsModal from "@/modal/ViewExam.modal";

interface Exam {
  id: string;
  name: string;
  group: string;
  normal_min: number | null;
  normal_max: number | null;
}

interface Props {
  exams: Exam[];
}

const GROUPS = [
  "Todos",
  "Homens adultos (18–59)",
  "Mulheres adultas (18–59)",
  "Idosos (≥ 60 anos)",
  "Crianças (>10 anos)",
  "Crianças (<10 anos)",
];

export default function ExamList({ exams }: Props) {
  const router = useRouter();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterGroup, setFilterGroup] = useState("Todos");

  const uniqueNames = useMemo(() => Array.from(new Set(exams.map((e) => e.name))), [exams]);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchName = filterName ? exam.name === filterName : true;
      const matchGroup = filterGroup === "Todos" ? true : exam.group === filterGroup;
      return matchName && matchGroup;
    });
  }, [exams, filterName, filterGroup]);

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id);
      router.refresh();
    } catch (err) {
      console.error("Erro ao deletar exame", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Exames</h1>
        <p className="text-muted-foreground text-sm">Total de exames: {filteredExams.length}</p>
      </header>

      {/* Filtros */}
      <section className="flex flex-col sm:flex-row gap-4 justify-center">
        <Select
          value={filterName || "__all__"}
          onValueChange={(val) => setFilterName(val === "__all__" ? "" : val)}
        >
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Filtrar por exame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os exames</SelectItem>
            {uniqueNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Filtrar por grupo" />
          </SelectTrigger>
          <SelectContent>
            {GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Botão adicionar exame */}
      <div className="flex justify-center">
        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary rounded-md text-primary hover:bg-primary/10 transition focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Adicionar novo exame"
            >
              <Plus className="w-5 h-5" />
              Adicionar Exame
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Exame</DialogTitle>
            </DialogHeader>
            <AddExamForm
              onSuccess={() => {
                router.refresh();
                setOpenAddModal(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de exames */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Card
              key={exam.id}
              onClick={() => {
                setSelectedExam(exam);
                setDetailsOpen(true);
              }}
              className="relative cursor-pointer group hover:shadow-lg transition-shadow rounded-md border border-border"
              tabIndex={0}
              role="button"
              aria-label={`Ver detalhes do exame ${exam.name}`}
              onKeyDown={(e) => e.key === "Enter" && setDetailsOpen(true)}
            >
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-primary">{exam.name}</h2>
                <p className="text-xs text-muted-foreground">ID: {exam.id}</p>
                <p className="text-sm text-muted-foreground">Grupo: {exam.group}</p>
                <p className="text-sm text-muted-foreground">
                  Valores normais:{" "}
                  <span className="font-medium">
                    {exam.normal_min ?? "-"} - {exam.normal_max ?? "-"}
                  </span>
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(exam.id);
                  }}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
                  aria-label={`Excluir exame ${exam.name}`}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 border rounded-lg bg-gray-50 p-4">
            Nenhum exame encontrado.
          </div>
        )}
      </section>

      {/* Modal de detalhes */}
      <ExamDetailsModal open={detailsOpen} onOpenChange={setDetailsOpen} exam={selectedExam} />
    </div>
  );
}
