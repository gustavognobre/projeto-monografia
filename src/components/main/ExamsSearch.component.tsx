'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Assumindo que você tem shadcn/ui Card
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, X, FolderKanban, CalendarDays, Info, FlaskConical, AlertCircle, TrendingDown, TrendingUp, CheckCircle, Trash2 } from 'lucide-react'; // Importando Trash2 para o ícone de lixeira
import { deleteExam_data } from '@/actions/exam_data';
// As importações de 'next/navigation' e da server action foram removidas para compatibilidade com o ambiente Canvas.
// import { useRouter } from 'next/navigation';
// import { deleteExam_data } from '@/lib/exam-actions';

// -------------------------------------------------------------------------
// *** IMPORTANTE: CERTIFIQUE-SE DE QUE ESTA É A ÚNICA DEFINIÇÃO DE UserExam ***
// -------------------------------------------------------------------------
interface Exam {
  id: string;
  name: string;
  group: string;
  normal_min: number | null;
  normal_max: number | null;
  intermediary_min: number | null;
  intermediary_max: number | null;
  hard_value: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserExam {
  id: string;
  value: number | null;
  notes: string | null;
  dateExam: string | null;
  show: boolean; // Propriedade 'show' para soft delete
  userId: string;
  examId: string;
  createdAt: Date | string | null;
  exam: Exam;
}

interface MyExamsClientProps {
  exams: UserExam[];
}
// -------------------------------------------------------------------------

// Helper para formatar a data para exibição (dd/MM/yyyy)
const formatDate = (dateInput?: string | Date | null) => {
  if (!dateInput) return 'Data não disponível';
  try {
    return format(new Date(dateInput), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

// Helper para converter para string ISO 8601 (para o atributo dateTime)
const toISODateString = (dateInput?: string | Date | null): string | undefined => {
  if (!dateInput) return undefined;
  try {
    const dateObj = new Date(dateInput);
    // Garante que é uma data válida antes de chamar toISOString()
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString();
    }
  } catch (e) {
    // Em caso de erro na conversão, retorna undefined
  }
  return undefined;
};

// Componente para a barra de busca
const SearchInput = ({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) => (
  <div className="relative max-w-md mx-auto">
    <input
      type="search"
      aria-label="Buscar exames pelo nome"
      placeholder="Buscar exame pelo nome..."
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-500 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
      autoComplete="off"
    />
    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />

    {value && (
      <button
        onClick={onClear}
        aria-label="Limpar busca"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        type="button"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    )}
  </div>
);

// Helper para determinar o status e as classes de cor do valor do exame
const getValueStatus = (value: number | null, exam: Exam) => {
  // Desestruturar e fornecer valores padrão numéricos se forem null
  const normalMin = exam.normal_min ?? -Infinity;
  const normalMax = exam.normal_max ?? Infinity;
  const intermediaryMin = exam.intermediary_min ?? -Infinity;
  const intermediaryMax = exam.intermediary_max ?? Infinity;
  const hardValue = exam.hard_value ?? Infinity;

  if (value === null) {
    return { status: 'Não Informado', icon: Info, colorClass: 'text-gray-700 bg-gray-50 border-gray-200' };
  }

  // Agora as comparações são seguras, pois os valores de referência não são null
  if (value >= normalMin && value <= normalMax) {
    return { status: 'Normal', icon: CheckCircle, colorClass: 'text-green-700 bg-green-50 border-green-200' };
  } else if (value >= intermediaryMin && value <= intermediaryMax) {
    return { status: 'Intermediário', icon: AlertCircle, colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
  } else if (value >= hardValue) {
    return { status: 'Crítico', icon: AlertCircle, colorClass: 'text-red-700 bg-red-50 border-red-200' };
  } else if (value < normalMin) { // Lida com "abaixo do normal" caso normalMin seja definido
    return { status: 'Abaixo do normal', icon: TrendingDown, colorClass: 'text-blue-700 bg-blue-50 border-blue-200' };
  }
  return { status: 'Inconclusivo', icon: Info, colorClass: 'text-gray-700 bg-gray-50 border-gray-200' };
};

// Componente individual do cartão do exame
const ExamCard = ({
  id, // Recebe o ID do exame para a função de delete
  exam,
  value,
  notes,
  dateExam,
  createdAt,
  onDelete, // Função de callback para deletar
}: Pick<UserExam, 'exam' | 'value' | 'notes' | 'dateExam' | 'createdAt'> & { id: string; onDelete: (id: string) => void; }) => {
  const { status, icon: StatusIcon, colorClass } = getValueStatus(value, exam);

  return (
    <Card
      tabIndex={0}
      className="rounded-xl border border-gray-100 bg-white shadow-sm
                transition-all hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 relative group" // Adicionado 'relative' e 'group' para posicionar o botão de lixeira
      role="region"
      aria-labelledby={`exam-title-${exam.id}`}
    >
      <CardContent className="p-6 flex flex-col gap-5">
        {/* Header: Nome e grupo com ícone */}
        <header className="flex flex-col gap-2">
          <h3
            id={`exam-title-${exam.id}`}
            className="text-2xl font-extrabold text-gray-900 truncate"
            title={exam.name}
          >
            {exam.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
            <span>{exam.group}</span>
          </div>
        </header>

        {/* Botão de lixeira (soft delete) */}
        <button
          onClick={() => onDelete(id)}
          aria-label={`Excluir exame ${exam.name}`}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        {/* Valor informado com destaque e status visual */}
        <section className={`p-4 rounded-lg border flex items-center justify-between ${colorClass}`}>
          <p className="text-lg font-semibold flex items-center gap-2">
            <StatusIcon className="h-6 w-6" aria-hidden="true" />
            Valor: <span className="text-xl font-bold">{value !== null ? value : 'N/A'}</span>
          </p>
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white bg-opacity-70 shadow-sm">{status}</span>
        </section>

        {/* Valores de referência */}
        <section className="text-sm text-gray-700 space-y-2">
          <strong className="block font-semibold text-gray-800">Valores de Referência</strong>
          <ul className="list-inside pl-4 space-y-1">
            <li>
              Normal: <span className="font-semibold">
                {exam.normal_min !== null ? exam.normal_min : 'N/A'} - {exam.normal_max !== null ? exam.normal_max : 'N/A'}
              </span>
            </li>
            <li>
              Intermediário: <span className="font-semibold">
                {exam.intermediary_min !== null ? exam.intermediary_min : 'N/A'} - {exam.intermediary_max !== null ? exam.intermediary_max : 'N/A'}
              </span>
            </li>
            <li>
              Crítico: <span className="font-semibold">
                {exam.hard_value !== null ? `${exam.hard_value}+` : 'N/A'}
              </span>
            </li>
          </ul>
        </section>

        {/* Data do exame com ícone */}
        <section className="flex items-center gap-2 text-indigo-700 font-semibold text-base">
          <CalendarDays className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          {/* Usa toISODateString para o atributo dateTime */}
          <time dateTime={toISODateString(dateExam)}>
            Data do exame: {formatDate(dateExam)}
          </time>
        </section>

        {/* Notas, destacadas */}
        {notes && (
          <section className="mt-2 bg-indigo-50 border-l-4 border-indigo-400 rounded-md p-3 flex items-start gap-2 text-indigo-900 text-sm italic shadow-sm">
            <Info className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span>Observações: {notes}</span>
          </section>
        )}

        {/* Data de criação (Rodapé) */}
        <footer className="text-xs text-gray-400 text-right mt-auto pt-4 border-t border-gray-100">
          {/* Usa toISODateString para o atributo dateTime */}
          Registrado em: <time dateTime={toISODateString(createdAt)}>
            {formatDate(createdAt)}
          </time>
        </footer>
      </CardContent>
    </Card>
  );
};

// --- Componente de Modal de Confirmação ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 opacity-100 duration-300 ease-out">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Componente de Notificação (Toast) ---
const NotificationToast = ({ message, type, isOpen, onClose }: {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
}) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Oculta o toast após 3 segundos
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg ${bgColor} ${textColor} transition-all duration-300 z-50`}>
      <p className="font-medium">{message}</p>
    </div>
  );
};


export const MyExamsClient = ({ exams }: MyExamsClientProps) => {
  // Estado local para gerenciar os exames e refletir as alterações no cliente
  const [currentExams, setCurrentExams] = useState<UserExam[]>(exams);
  const [search, setSearch] = useState('');

  // Estados para o Modal de Confirmação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examToDeleteId, setExamToDeleteId] = useState<string | null>(null);

  // Estados para a Notificação (Toast)
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Removido: const router = useRouter(); // Removido para compatibilidade com o ambiente Canvas


  // Sincroniza o estado local com a prop 'exams' se ela mudar
  // Útil se a prop 'exams' puder ser atualizada de fora do componente
  useMemo(() => {
    setCurrentExams(exams);
  }, [exams]);


  // Filtra exames com base no termo de busca E também filtra para mostrar apenas exames com 'show: true'
  const filteredExams = useMemo(() => {
    const term = search.trim().toLowerCase();
    // Primeiro, filtra para mostrar apenas os exames visíveis (show: true)
    const visibleExams = currentExams.filter(exam => exam.show === true); // Usa o estado local 'currentExams'

    if (!term) return visibleExams;

    return visibleExams.filter(({ exam }) =>
      exam?.name.toLowerCase().includes(term)
    );
  }, [currentExams, search]); // Dependência ajustada para 'currentExams'

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  const clearSearch = useCallback(() => setSearch(''), []);

  // Abre o modal de confirmação
  const handleOpenDeleteModal = useCallback((id: string) => {
    setExamToDeleteId(id);
    setIsModalOpen(true);
  }, []);

  // Confirmação de exclusão (chamada pelo modal)
  const handleConfirmDelete = useCallback(async () => {
    if (!examToDeleteId) return;

    setIsModalOpen(false); // Fecha o modal

    try {
      // Simula a atualização do banco de dados alterando o estado local
      setCurrentExams(prevExams =>
        prevExams.map(exam =>
          exam.id === examToDeleteId ? { ...exam, show: false } : exam
        )
      );
      setToastMessage('Exame ocultado com sucesso!');
      setToastType('success');
      setIsToastOpen(true);
      // console.log(`Soft delete simulado para o exame com ID: ${examToDeleteId}.`);
      // Em um aplicativo Next.js real, aqui você chamaria sua server action:
      await deleteExam_data(examToDeleteId);
      // E então router.refresh(); para buscar os dados atualizados do servidor.
    } catch (error) {
      console.error("Erro ao simular soft delete:", error);
      setToastMessage('Erro ao ocultar exame.');
      setToastType('error');
      setIsToastOpen(true);
    } finally {
      setExamToDeleteId(null); // Limpa o ID após a operação
    }
  }, [examToDeleteId]);

  // Fecha o modal de confirmação
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setExamToDeleteId(null); // Limpa o ID ao fechar o modal
  }, []);

  // Fecha a notificação (toast)
  const handleCloseToast = useCallback(() => {
    setIsToastOpen(false);
    setToastMessage('');
  }, []);


  return (
    <section className="space-y-10 max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      {/* Componente de busca */}
      <SearchInput value={search} onChange={onSearchChange} onClear={clearSearch} />

      {/* Exibição dos exames filtrados */}
      {filteredExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500">
          <FolderKanban className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-center">
            Nenhum exame encontrado para sua busca.
          </p>
          <p className="text-sm mt-1">
            Tente um termo diferente ou limpe a busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredExams.map(({ id, exam, value, notes, dateExam, createdAt }) => (
            <ExamCard
              key={id}
              id={id} // Passa o ID do exame para o ExamCard
              exam={exam}
              value={value}
              notes={notes}
              dateExam={dateExam}
              createdAt={createdAt}
              onDelete={handleOpenDeleteModal} // Agora abre o modal ao clicar em deletar
            />
          ))}
        </div>
      )}

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Ocultação de Exame"
        message="Tem certeza que deseja ocultar este exame? Ele não será removido permanentemente, apenas ficará invisível."
      />

      {/* Notificação (Toast) */}
      <NotificationToast
        isOpen={isToastOpen}
        onClose={handleCloseToast}
        message={toastMessage}
        type={toastType}
      />
    </section>
  );
};
