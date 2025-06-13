"use client";

import { useState, useMemo } from "react";
import { Plus, Trash, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteExam } from "@/actions/exams";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const uniqueNames = useMemo(() => {
    return Array.from(new Set(exams.map((e) => e.name)));
  }, [exams]);

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
    <div className="max-w-5xl mx-auto px-4 pt-24 space-y-10">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold">Gerenciar Exames</h1>
        <p className="text-muted-foreground text-sm">
          Total de exames: {filteredExams.length}
        </p>
      </div>

      {/* Filtros */}
      <section className="flex flex-col sm:flex-row gap-4 justify-center">
        <Select value={filterName || "__all__"} onValueChange={(val) => setFilterName(val === "__all__" ? "" : val)}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Filtrar por exame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os exames</SelectItem>
            {uniqueNames.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Filtrar por grupo" />
          </SelectTrigger>
          <SelectContent>
            {GROUPS.map((group) => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Lista */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Novo exame */}
        <Card className="border-dashed border-2 hover:bg-muted/40 transition cursor-pointer">
          <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center h-full p-6">
                <Plus className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm font-medium text-primary">Adicionar Exame</p>
              </div>
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
        </Card>

        {/* Lista de exames */}
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Card
              key={exam.id}
              onClick={() => {
                setSelectedExam(exam);
                setDetailsOpen(true);
              }}
              className="cursor-pointer relative group hover:shadow-md transition"
            >
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-blue-600">{exam.name}</h2>
                <p className="text-xs text-gray-400">ID: {exam.id}</p>
                <p className="text-sm text-gray-600">Grupo: {exam.group}</p>
                <p className="text-sm">
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
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
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
      <ExamDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        exam={selectedExam}
      />
    </div>
  );
}
