"use client";

import React, { useEffect, useState } from "react";
import { updateExam } from "@/actions/exams";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

const GROUP_OPTIONS = [
  "Homens adultos (18–59)",
  "Mulheres adultas (18–59)",
  "Idosos (≥ 60 anos)",
  "Crianças (>10 anos)",
  "Crianças (<10 anos)",
  "Todos",
];

interface Exam {
  id: string;
  name: string;
  group: string;
  normal_min: number | null;
  normal_max: number | null;
  intermediary_min?: number | null;
  intermediary_max?: number | null;
  hard_value?: number | null;
  unit?: string | null;
}

interface ExamDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam | null;
}

export default function ExamDetailsModal({
  open,
  onOpenChange,
  exam,
}: ExamDetailsModalProps) {
  const [formData, setFormData] = useState<Exam | null>(null);

  useEffect(() => {
    if (exam) {
      setFormData({ ...exam });
    }
  }, [exam]);

  if (!formData) return null;

  function handleChange(field: keyof Exam, value: string | number | null) {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function handleNumberChange(field: keyof Exam, value: string) {
    if (value === "") {
      handleChange(field, null);
    } else {
      const parsed = parseFloat(value);
      handleChange(field, Number.isNaN(parsed) ? null : parsed);
    }
  }

  async function handleUpdate(formData: FormData) {
    const id = formData.get("id") as string;
    await updateExam(formData, id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            Editar Exame
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Altere os dados e clique em salvar.
          </DialogDescription>
        </DialogHeader>

        <form action={handleUpdate} className="space-y-6 text-sm">
          <input type="hidden" name="id" value={formData.id} />

          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium text-gray-700">
              Nome do exame
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nome do exame"
              required
              className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="group"
              className="block font-medium text-gray-700"
            >
              Grupo
            </label>
            <Select
              name="group"
              defaultValue={formData.group}
              onValueChange={(value) => handleChange("group", value)}
            >
              <SelectTrigger
                id="group"
                className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
              >
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {GROUP_OPTIONS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
            <legend className="text-sm font-semibold text-muted-foreground">
              Valores Normais
            </legend>
            <div className="flex gap-6">
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="normal_min"
                  className="font-medium mb-1 text-gray-700"
                >
                  Mínimo
                </label>
                <Input
                  id="normal_min"
                  type="number"
                  name="normal_min"
                  defaultValue={formData.normal_min ?? ""}
                  onChange={(e) =>
                    handleNumberChange("normal_min", e.target.value)
                  }
                  placeholder="0.0"
                  step="any"
                  className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="normal_max"
                  className="font-medium mb-1 text-gray-700"
                >
                  Máximo
                </label>
                <Input
                  id="normal_max"
                  type="number"
                  name="normal_max"
                  defaultValue={formData.normal_max ?? ""}
                  onChange={(e) =>
                    handleNumberChange("normal_max", e.target.value)
                  }
                  placeholder="0.0"
                  step="any"
                  className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
            <legend className="text-sm font-semibold text-muted-foreground">
              Valores Intermediários
            </legend>
            <div className="flex gap-6">
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="intermediary_min"
                  className="font-medium mb-1 text-gray-700"
                >
                  Mínimo
                </label>
                <Input
                  id="intermediary_min"
                  type="number"
                  name="intermediary_min"
                  defaultValue={formData.intermediary_min ?? ""}
                  onChange={(e) =>
                    handleNumberChange("intermediary_min", e.target.value)
                  }
                  placeholder="0.0"
                  step="any"
                  className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="intermediary_max"
                  className="font-medium mb-1 text-gray-700"
                >
                  Máximo
                </label>
                <Input
                  id="intermediary_max"
                  type="number"
                  name="intermediary_max"
                  defaultValue={formData.intermediary_max ?? ""}
                  onChange={(e) =>
                    handleNumberChange("intermediary_max", e.target.value)
                  }
                  placeholder="0.0"
                  step="any"
                  className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </fieldset>

          <div className="space-y-2">
            <label
              htmlFor="hard_value"
              className="block font-medium text-gray-700"
            >
              Valor de Risco
            </label>
            <Input
              id="hard_value"
              type="number"
              name="hard_value"
              defaultValue={formData.hard_value ?? ""}
              onChange={(e) => handleNumberChange("hard_value", e.target.value)}
              placeholder="Ex: 200.0"
              step="any"
              className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="unit" className="block font-medium text-gray-700">
              Unidade
            </label>
            <Input
              id="unit"
              name="unit"
              defaultValue={formData.unit ?? ""}
              onChange={(e) => handleChange("unit", e.target.value)}
              placeholder="Ex: /mg"
              className="rounded-md border border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
            />
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              className="focus:ring-blue-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-md transition-colors focus:ring-2 focus:ring-blue-600"
            >
              <PlusCircle className="w-4 h-4" />
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
