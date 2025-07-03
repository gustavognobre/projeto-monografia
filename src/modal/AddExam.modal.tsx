"use client";

import { createExam_data } from "@/actions/exam_data";
// Removido import { createExam_data } from "@/actions/exam_data"; pois não é suportado no ambiente.
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
  unit?:string|null;
}

interface ExamModalProps {
  exam: Exam | null;
  onClose: () => void;
  user: { id: string } | null; // Tipagem ajustada para `user`
}

export default function ExamModal({ exam, onClose, user }: ExamModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para a mensagem de erro
  const formRef = useRef<HTMLFormElement>(null);

  if (!exam) return null;

  const handleSubmit = async (formData: FormData) => {
    const value = formData.get("value")?.toString().trim();

    // Limpa qualquer mensagem de erro anterior
    setErrorMessage(null);

    if (!value) {
      setErrorMessage("O campo 'Valor' é obrigatório."); // Define a mensagem de erro
      return;
    }

    try {
      await createExam_data(formData);
      setIsSuccess(true);
      formRef.current?.reset();
    } catch (error) {
      console.error("Erro ao criar dados do exame:", error);
      setErrorMessage("Erro ao salvar dados do exame. Tente novamente."); // Mensagem de erro genérica
    }
  };

  // Garante que userId tenha um valor, mesmo que `user` seja nulo
  const userId = user?.id || "anonymous_user_id";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 rounded-md" // Adicionado p-4 para espaçamento em telas pequenas
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} // Fundo escurecido semi-transparente
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative space-y-6 transform transition-all scale-100 opacity-100 rounded-md"> {/* Alterado max-w-xl para max-w-lg */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl font-bold p-1 rounded-full hover:bg-gray-100 transition-colors" // Melhoria no botão de fechar
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times; {/* Ícone de 'x' mais padrão */}
        </button>

        <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-3 mb-4">Preencher Dados do Exame</h2> {/* Título maior e com linha */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm"> {/* Estilo aprimorado para a seção de detalhes e aumentado o gap */}
          <div>
            <p className="text-gray-600 font-medium text-xs uppercase mb-0.5">Nome do Exame</p> {/* Adicionado mb-0.5 */}
            <p className="text-blue-700 font-bold text-lg">{exam.name}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium text-xs uppercase mb-0.5">Grupo</p> {/* Adicionado mb-0.5 */}
            <p className="text-gray-800 text-base">{exam.group}</p>
          </div>
          {/* Alterado de grid para flex-col para empilhar os valores */}
          <div className="sm:col-span-2 flex flex-col gap-4 pt-2"> {/* Layout flex-col para faixas */}
            <div>
              <p className="text-gray-600 font-medium text-xs uppercase mb-0.5">Normal</p> {/* Adicionado mb-0.5 */}
              <p className="text-green-700 bg-green-100 px-3 py-1 rounded-md inline-flex items-center font-medium">
                {exam.normal_min ?? "N/A"} – {exam.normal_max ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium text-xs uppercase mb-0.5">Intermediária</p> {/* Adicionado mb-0.5 */}
              <p className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-md inline-flex items-center font-medium">
                {exam.intermediary_min ?? "N/A"} – {exam.intermediary_max ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium text-xs uppercase mb-0.5">Crítico</p> {/* Adicionado mb-0.5 */}
              <p className="text-red-700 bg-red-100 px-3 py-1 rounded-md inline-flex items-center font-medium">
                ≥ {exam.hard_value ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium text-xs uppercase mb-0.5">Unidade de Medida</p> {/* Adicionado mb-0.5 */}
              <p className="px-3 py-1 rounded-md inline-flex items-center font-medium">
                ≥ {exam.unit ?? "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem de sucesso */}
        {isSuccess && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm flex justify-between items-center animate-fade-in">
            <span className="font-semibold">Dados salvos com sucesso!</span>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs text-green-700 hover:underline ml-2"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Mensagem de erro */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm flex justify-between items-center animate-fade-in">
            <span className="font-semibold">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-700 hover:underline ml-2"
            >
              Fechar
            </button>
          </div>
        )}

        <form
          ref={formRef}
          action={async (formData) => handleSubmit(formData)}
          className="space-y-5"
        >
          <input type="hidden" name="examId" value={exam.id} />
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="show" value="true" />

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Valor do Exame <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="value"
              name="value"
              className="w-full border h-10 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Digite o valor do exame"
              onChange={() => setErrorMessage(null)} // Limpa o erro ao digitar
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações (Opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3} // Aumentado o número de linhas para mais espaço
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Ex: jejum, medicamento, histórico relevante, etc."
            />
          </div>
          <div>
            <label htmlFor="lab" className="block text-sm font-medium text-gray-700 mb-1">
              Laboratório
            </label>
             <input
              type="text"
              id="lab"
              name="lab"
              className="w-full border h-10 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Em qual Laboratório foi feito?"
              onChange={() => setErrorMessage(null)} // Limpa o erro ao digitar
            />
          </div>
          <div>
            <label htmlFor="dateExam" className="block text-sm font-medium text-gray-700 mb-1">
              Data do Exame <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateExam"
              name="dateExam"
              className="w-full h-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              // Define a data atual como valor padrão, se desejar
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Salvar Dados do Exame
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
