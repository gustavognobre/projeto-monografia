'use client';

import { createExam } from '@/actions/exams';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

export default function AddExam() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
    }
  }, [searchParams]);

  return (
    <section className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Cadastrar Novo Exame</h2>

      {showSuccess && (
        <Alert className="bg-green-100 border-green-300 text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Exame cadastrado com sucesso!</AlertDescription>
        </Alert>
      )}

      <form action={createExam} method="POST" className="space-y-4">
        <Input name="name" placeholder="Nome do exame" required />

        <Select name="group" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Homens adultos (18–59)">Homens adultos (18–59)</SelectItem>
            <SelectItem value="Mulheres adultas (18–59)">Mulheres adultas (18–59)</SelectItem>
            <SelectItem value="Idosos (≥ 60 anos)">Idosos (≥ 60 anos)</SelectItem>
            <SelectItem value="Crianças (>10 anos)">Crianças (&gt;10 anos)</SelectItem>
            <SelectItem value="Crianças (<10 anos)">Crianças (&lt;10 anos)</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="normal_min"
            placeholder="Mínimo Normal"
            step="any"
            required
          />
          <Input
            type="number"
            name="normal_max"
            placeholder="Máximo Normal"
            step="any"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="intermediary_min"
            placeholder="Mínimo Intermediário"
            step="any"
          />
          <Input
            type="number"
            name="intermediary_max"
            placeholder="Máximo Intermediário"
            step="any"
          />
        </div>

        <Input
          type="number"
          name="hard_value"
          placeholder="Valor de Risco"
          step="any"
        />

        <div className="flex justify-between gap-4 pt-4">
          <Button type="submit" className="w-full">
            Criar Exame
          </Button>
          <Link href="/parameter" className="w-full">
            <Button variant="outline" className="w-full">
              Voltar
            </Button>
          </Link>
        </div>
      </form>
    </section>
  );
}
