'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Assumindo que você tem shadcn/ui Card
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, X, FolderKanban, CalendarDays, Info, FlaskConical, AlertCircle, TrendingDown, TrendingUp, CheckCircle } from 'lucide-react'; // Importando ícones Lucide

// -------------------------------------------------------------------------
// *** IMPORTANTE: CERTIFIQUE-SE DE QUE ESTA É A ÚNICA DEFINIÇÃO DE UserExam ***
// -------------------------------------------------------------------------
interface Exam {
  id: string;
  name: string;
  group: string;
  normal_min: number | null; // <--- Alterado para aceitar null
  normal_max: number | null; // <--- Alterado para aceitar null
  intermediary_min: number | null; // <--- Alterado para aceitar null
  intermediary_max: number | null; // <--- Alterado para aceitar null
  hard_value: number | null; // <--- Alterado para aceitar null
  createdAt: Date;
  updatedAt: Date;
}

interface UserExam {
  id: string;
  value: number | null;
  notes: string | null;
  dateExam: string | null;
  show: boolean;
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
  exam,
  value,
  notes,
  dateExam,
  createdAt,
}: Pick<UserExam, 'exam' | 'value' | 'notes' | 'dateExam' | 'createdAt'>) => {
  const { status, icon: StatusIcon, colorClass } = getValueStatus(value, exam);

  return (
    <Card
      tabIndex={0}
      className="rounded-xl border border-gray-100 bg-white shadow-sm
                transition-all hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
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
            <Info className="h-5 w-5 flex-shrink-0 text-indigo-600" aria-hidden="true" />
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

export const MyExamsClient = ({ exams }: MyExamsClientProps) => {
  const [search, setSearch] = useState('');

  // Filtra exames com base no termo de busca
  const filteredExams = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return exams;

    return exams.filter(({ exam }) =>
      exam?.name.toLowerCase().includes(term)
    );
  }, [exams, search]);

  // Handler para a mudança do input de busca
  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  // Handler para limpar a busca
  const clearSearch = useCallback(() => setSearch(''), []);

  return (
    <section className="space-y-10 max-w-7xl mx-auto px-4 py-8 md:py-12  min-h-screen">
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
              exam={exam}
              value={value}
              notes={notes}
              dateExam={dateExam}
              createdAt={createdAt}
            />
          ))}
        </div>
      )}
    </section>
  );
};
