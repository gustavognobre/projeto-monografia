"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExamData {
  id: string;
  dateExam: string;
  value: number;
  lab?: string | null;
  notes?: string;
}

interface Exam {
  id: string;
  name: string;
  group: string;
  unit: string;
  exam_data: ExamData[];
}

interface Props {
  exams: Exam[];
}

export default function ExamsTable({ exams }: Props) {
  const flatData = useMemo(() => {
    return exams.flatMap((exam) =>
      exam.exam_data.map((data) => ({
        id: data.id,
        examName: exam.name,
        group: exam.group,
        unit: exam.unit,
        value: data.value,
        date: format(new Date(data.dateExam), "dd/MM/yyyy", { locale: ptBR }),
        lab: data.lab ?? "-",
        notes: data.notes ?? "-",
      }))
    );
  }, [exams]);

  if (!flatData.length) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        Dados indisponíveis.
      </div>
    );
  }

  return (
    <Card className="mt-6 shadow-md rounded-2xl border">
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Nome do Exame</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Laboratório</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.examName}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.lab}</TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
