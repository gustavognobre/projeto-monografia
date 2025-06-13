"use client";

import { createExam_data } from "@/actions/exam_data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRef, useState } from "react";

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

interface ExamModalProps {
  exam: Exam | null;
  onClose: () => void;
  user: any;
}

export default function ExamModal({ exam, onClose, user }: ExamModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!exam) return null;

  const handleSubmit = async (formData: FormData) => {
    const value = formData.get("value")?.toString().trim();

    if (!value) {
      alert("O campo de valor do exame é obrigatório.");
      return;
    }

    try {
      await createExam_data(formData);
      setIsSuccess(true);
      formRef.current?.reset();
    } catch (error) {
      console.error("Erro ao criar dados do exame:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Fundo escurecido semi-transparente
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative space-y-6">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-gray-800">Preencher Exame</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 border rounded-xl p-4">
          <div>
            <p className="text-gray-500 font-medium">Nome</p>
            <p className="text-blue-600 font-semibold">{exam.name}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Grupo</p>
            <p className="text-gray-800">{exam.group}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Faixa Normal</p>
            <p className="text-green-700 bg-green-100 px-2 py-0.5 rounded">
              {exam.normal_min} – {exam.normal_max}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Intermediária</p>
            <p className="text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
              {exam.intermediary_min} – {exam.intermediary_max}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-500 font-medium">Crítico</p>
            <p className="text-red-700 bg-red-100 px-2 py-0.5 rounded w-fit">
              ≥ {exam.hard_value}
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
            Dados salvos com sucesso!
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs underline ml-2"
            >
              Fechar
            </button>
          </div>
        )}

        <form
          ref={formRef}
          action={async (formData) => handleSubmit(formData)}
          className="space-y-4"
        >
          <input type="hidden" name="examId" value={exam.id} />
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="show" value="true" />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Valor
            </label>
            <input
              type="text"
              name="value"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o valor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Observações
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: jejum, medicamento, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Data do exame
            </label>
            <input
              type="date"
              name="dateExam"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Criar Exame
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
