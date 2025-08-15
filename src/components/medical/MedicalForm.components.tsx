"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createMedico } from "@/actions/medic";

const estados = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

interface FormDataState {
  nome: string;
  email: string;
  crm: string;
  tipo: string;
  situacao: string;
  especialidade: string;
  area: string;
  uf: string;
}

interface MedicoFormProps {
  onClose: () => void;
  initialData?: Partial<FormDataState>;
}

export default function MedicoForm({ onClose, initialData }: MedicoFormProps) {
  const [form, setForm] = useState<FormDataState>({
    nome: "",
    email: "",
    crm: "",
    tipo: "",
    situacao: "",
    especialidade: "",
    area: "",
    uf: "",
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (field: keyof FormDataState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function consultarCRM() {
    if (!form.uf || !form.crm) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/consulta-crm?uf=${form.uf}&crm=${form.crm}`);
      const data = await res.json();

      if (res.ok && data.nome) {
        setForm({
          nome: data.nome || "",
          email: data.email || form.email || "",
          crm: data.crm || form.crm,
          tipo: data.tipo_inscricao || "",
          situacao: data.situacao || "",
          especialidade: data.especialidade || "",
          area: data.area_atuacao || "",
          uf: data.uf || form.uf,
        });
      } else {
        setForm((prev) => ({
          ...prev,
          nome: "",
          email: "",
          tipo: "",
          situacao: "",
          especialidade: "",
          area: "",
        }));
      }
      setShowForm(true);
    } catch (error) {
      console.error("Erro na consulta de CRM:", error);
      setShowForm(true);
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await createMedico(data);
      alert("Cadastro finalizado!");
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar médico:", error);
      alert("Erro ao finalizar cadastro. Tente novamente.");
    }
  };

  return (
    <>
      {!showForm && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>UF</Label>
              <Select
                onValueChange={(val) => handleChange("uf", val)}
                value={form.uf}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>CRM</Label>
              <Input
                type="text"
                value={form.crm}
                onChange={(e) => handleChange("crm", e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={consultarCRM}
            disabled={loading || !form.uf || !form.crm}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold py-4 rounded-full transition-all duration-300 mb-6"
          >
            {loading ? "Consultando..." : "Consultar CRM"}
          </Button>
        </>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Nome do Médico</Label>
            <Input
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label>CRM</Label>
            <Input
              value={form.crm}
              onChange={(e) => handleChange("crm", e.target.value)}
            />
          </div>
          <div>
            <Label>UF</Label>
            <Select
              onValueChange={(val) => handleChange("uf", val)}
              value={form.uf}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de Inscrição</Label>
            <Select
              onValueChange={(val) => handleChange("tipo", val)}
              value={form.tipo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Principal">Principal</SelectItem>
                <SelectItem value="Secundária">Secundária</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Situação</Label>
            <Select
              onValueChange={(val) => handleChange("situacao", val)}
              value={form.situacao}
            >
              <SelectTrigger>
                <SelectValue placeholder="Situação atual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Especialidade</Label>
            <Input
              value={form.especialidade}
              onChange={(e) => handleChange("especialidade", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Área de Atuação</Label>
            <Input
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          <div className="col-span-full pt-4">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full"
            >
              Finalizar Cadastro
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
