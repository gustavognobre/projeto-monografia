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

  // Aqui está a action server para o formulário
  // Essa função roda no servidor quando o form for submetido
  async function handleUpdate(formData: FormData) {
    const id = formData.get("id") as string;
    await updateExam(formData, id);
    onOpenChange(false);
  }

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Editar Exame</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Altere os dados e clique em salvar.
        </DialogDescription>
      </DialogHeader>

      <form action={handleUpdate} className="space-y-6 text-sm">
        <input type="hidden" name="id" value={formData.id} />

        <div className="space-y-2">
          <label htmlFor="name" className="block font-medium">
            Nome do exame
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nome do exame"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="group" className="block font-medium">
            Grupo
          </label>
          <Select
            name="group"
            defaultValue={formData.group}
            onValueChange={(value) => handleChange("group", value)}
          >
            <SelectTrigger id="group">
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

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-muted-foreground">
            Valores Normais
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="normal_min" className="block font-medium">
                Mínimo
              </label>
              <Input
                id="normal_min"
                type="number"
                name="normal_min"
                defaultValue={formData.normal_min ?? ""}
                onChange={(e) => handleNumberChange("normal_min", e.target.value)}
                placeholder="0.0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="normal_max" className="block font-medium">
                Máximo
              </label>
              <Input
                id="normal_max"
                type="number"
                name="normal_max"
                defaultValue={formData.normal_max ?? ""}
                onChange={(e) => handleNumberChange("normal_max", e.target.value)}
                placeholder="0.0"
                step="any"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-muted-foreground">
            Valores Intermediários
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="intermediary_min" className="block font-medium">
                Mínimo
              </label>
              <Input
                id="intermediary_min"
                type="number"
                name="intermediary_min"
                defaultValue={formData.intermediary_min ?? ""}
                onChange={(e) => handleNumberChange("intermediary_min", e.target.value)}
                placeholder="0.0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="intermediary_max" className="block font-medium">
                Máximo
              </label>
              <Input
                id="intermediary_max"
                type="number"
                name="intermediary_max"
                defaultValue={formData.intermediary_max ?? ""}
                onChange={(e) => handleNumberChange("intermediary_max", e.target.value)}
                placeholder="0.0"
                step="any"
              />
            </div>
          </div>
        </fieldset>

        <div className="space-y-2">
          <label htmlFor="hard_value" className="block font-medium">
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
          />
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

}
