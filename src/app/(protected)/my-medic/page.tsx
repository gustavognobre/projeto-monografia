"use client";

import React, { useState, useEffect } from "react";
import { getMedicoByCrm } from "@/actions/medic";
import { useSession } from "next-auth/react";
import { createPatient, getMyDoctors } from "@/actions/patient_relation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UFs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

interface Medico {
  id: string;
  nomeUsuario: string;
  crm: string;
  uf: string;
  email: string;
  especialidade?: string;
  area?: string;
  tipo?: string;
  situacao?: string;
  criadoEm: string;
}

interface ResultData {
  medico: {
    nome: string;
    crm: string;
    uf: string;
    email?: string;
    especialidade?: string;
  };
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    dateBirth?: string | null;
    gender?: string | null;
    role?: string | null;
  };
}

export default function MyMedicPage() {
  const [crm, setCrm] = useState("");
  const [uf, setUf] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [myDoctors, setMyDoctors] = useState<Medico[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    (async () => {
      try {
        const doctors = await getMyDoctors(session.user.id);

        // Ordenar do mais novo para o mais antigo
        const sortedDoctors = doctors.sort(
          (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        );

        setMyDoctors(sortedDoctors);
      } catch (error) {
        console.error("Erro ao buscar médicos relacionados:", error);
      }
    })();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!crm.trim() || !uf.trim()) {
      alert("Informe CRM e UF.");
      return;
    }

    setLoading(true);
    try {
      const data = await getMedicoByCrm(crm.trim(), uf.trim());
      if (data?.medico) {
        setResult(data);
      } else {
        alert("Médico não encontrado.");
        setResult(null);
      }
    } catch (err) {
      console.error("Erro ao buscar médico:", err);
      alert("Erro ao buscar médico.");
      setResult(null);
    } finally {
      setLoading(false);
      setCrm("");
      setUf("");
    }
  };

  const handlePatient = async () => {
    if (!result?.user?.id || !session?.user?.id) return;

    try {
      await createPatient(result.user.id, session.user.id);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao criar paciente:", err);
      alert("Erro ao vincular paciente.");
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Médicos</h1>
        <p className="text-muted-foreground text-sm">
          Vincule médicos para que eles possam acessar seus exames.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
        noValidate
      >
        <Input
          placeholder="CRM do médico"
          value={crm}
          onChange={(e) => setCrm(e.target.value.toUpperCase())}
          autoComplete="off"
          required
          aria-label="CRM do médico"
        />
        <Select value={uf} onValueChange={setUf} required aria-label="UF do CRM">
          <SelectTrigger>
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            {UFs.map((uf) => (
              <SelectItem key={uf} value={uf}>
                {uf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button type="submit"  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={loading} aria-disabled={loading}>
          {loading ? "Buscando..." : "Adicionar Médico"}
        </button>
      </form>

      {result && (
        <Card
          className="p-6 border-l-4 border-primary bg-muted cursor-pointer transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={handlePatient}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePatient();
            }
          }}
          aria-label={`Vincular médico ${result.medico.nome}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {result.user?.image && (
              <img
                src={result.user.image}
                alt={`Foto do médico ${result.medico.nome}`}
                className="w-24 h-24 rounded-full border object-cover flex-shrink-0"
              />
            )}

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">Médico</h2>
                <p><strong>Nome:</strong> {result.medico.nome}</p>
                <p>
                  <strong>CRM:</strong> {result.medico.crm} / {result.medico.uf}
                </p>
                <p><strong>Email:</strong> {result.medico.email ?? "-"}</p>
                <p><strong>Especialidade:</strong> {result.medico.especialidade ?? "-"}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">Usuário</h2>
                <p><strong>Nome:</strong> {result.user?.name ?? "-"}</p>
                <p><strong>Email:</strong> {result.user?.email ?? "-"}</p>
                <p><strong>Data Nasc.:</strong> {result.user?.dateBirth ?? "-"}</p>
                <p><strong>Gênero:</strong> {result.user?.gender ?? "-"}</p>
                <p><strong>Função:</strong> {result.user?.role ?? "-"}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground italic">
            Clique para vincular este médico.
          </p>
        </Card>
      )}

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Meus Médicos</h2>
        {myDoctors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Você ainda não adicionou nenhum médico.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {myDoctors.map((medico) => (
              <Card key={medico.id} className="p-4 border hover:shadow transition">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-primary">{medico.nomeUsuario}</h3>
                  <Badge variant="outline">
                    {medico.crm} / {medico.uf}
                  </Badge>
                </div>
                <div className="text-sm mt-2 space-y-1">
                  <p>Email: {medico.email}</p>
                  <p>Especialidade: {medico.especialidade ?? "-"}</p>
                  <p>Área: {medico.area ?? "-"}</p>
                  <p>Tipo: {medico.tipo ?? "-"}</p>
                  <p>Situação: {medico.situacao ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">
                    Cadastrado em {new Date(medico.criadoEm).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
