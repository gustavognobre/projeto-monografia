"use client";

import { createExam } from "@/actions/exams";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, PlusCircle } from "lucide-react";

export default function AddExamForm({ onSuccess }: { onSuccess?: () => void }) {
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createExam(formData);
    setShowSuccess(true);
    onSuccess?.();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {showSuccess && (
        <Alert className="bg-green-100 border-green-300 text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Exame cadastrado com sucesso!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="block font-medium text-sm">
          Nome do exame
        </label>
        <Input id="name" name="name" placeholder="Nome do exame" required />
      </div>

      <div className="space-y-1">
        <label htmlFor="group" className="block font-medium text-sm">
          Grupo
        </label>
        <Select name="group" required>
          <SelectTrigger id="group">
            <SelectValue placeholder="Selecione o grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Homens adultos (18–59)">Homens adultos (18–59)</SelectItem>
            <SelectItem value="Mulheres adultas (18–59)">Mulheres adultas (18–59)</SelectItem>
            <SelectItem value="Idosos (≥ 60 anos)">Idosos (≥ 60 anos)</SelectItem>
            <SelectItem value="Crianças (>10 anos)">Crianças (&gt;10 anos)</SelectItem>
            <SelectItem value="Crianças (<10 anos)">Crianças (&lt;10 anos)</SelectItem>
            <SelectItem value="Todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <fieldset>
        <legend className="block font-semibold text-sm mb-2">Valores Normais</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="normal_min" className="block font-medium text-sm">
              Valor mínimo
            </label>
            <Input
              id="normal_min"
              type="number"
              name="normal_min"
              placeholder="Valor mínimo (Normal)"
              step="any"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="normal_max" className="block font-medium text-sm">
              Valor máximo
            </label>
            <Input
              id="normal_max"
              type="number"
              name="normal_max"
              placeholder="Valor máximo (Normal)"
              step="any"
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="block font-semibold text-sm mb-2">Valores Intermediários</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="intermediary_min" className="block font-medium text-sm">
              Valor mínimo
            </label>
            <Input
              id="intermediary_min"
              type="number"
              name="intermediary_min"
              placeholder="Valor mínimo (Intermediário)"
              step="any"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="intermediary_max" className="block font-medium text-sm">
              Valor máximo
            </label>
            <Input
              id="intermediary_max"
              type="number"
              name="intermediary_max"
              placeholder="Valor máximo (Intermediário)"
              step="any"
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="hard_value" className="block font-medium text-sm">
          Valor de Risco
        </label>
        <Input
          id="hard_value"
          type="number"
          name="hard_value"
          placeholder="Valor de Risco"
          step="any"
        />
      </div>
            <div className="space-y-1">
        <label htmlFor="unit" className="block font-medium text-sm">
          Unidade de Medida
        </label>
        <Input
          id="unit"
          name="unit"
          placeholder="Unidade de Medida"
          step="any"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-md transition-colors"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Criar Exame
      </Button>
    </form>
  );
}
