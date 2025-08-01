"use client";

import { useState } from "react";
import { Plus, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import AddAnthropometryForm from "@/modal/AddAnthropometry.modal";

interface Anthropometry {
  id: string;
  createdAt: string;
  show: boolean;
  userId: string;
  height: number | null;
  weight: number | null;
  chest: number | null;
  shoulder: number | null;
  rightArm: number | null;
  leftArm: number | null;
  waist: number | null;
  rightLeg: number | null;
  leftLeg: number | null;
  rightCalf: number | null;
  leftCalf: number | null;
  notes: string | null;
  dateExam: string | null;
}

interface Props {
  anthropometry: Anthropometry[];
  user: any;
}

const formatDate = (date: string | null): string => {
  return date ? new Date(date).toLocaleDateString("pt-BR") : "Sem data";
};

export default function NewAntropometria({ anthropometry, user }: Props) {
  const router = useRouter();
  const [openAddModal, setOpenAddModal] = useState(false);

  const renderMeasure = (label: string, value: number | null) => (
    <div className="flex items-center text-sm text-muted-foreground">
      <Ruler className="w-4 h-4 text-primary mr-2" />
      <strong className="text-primary">{label}</strong>
      <span className="ml-1">{value ?? "-"} cm</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Botão de Adição */}
        <Card
          onClick={() => setOpenAddModal(true)}
          className="border-2 border-dashed border-primary/50 bg-muted/40 text-primary
                     hover:bg-primary/10 hover:shadow-md cursor-pointer transition rounded-2xl p-6 flex flex-col items-center justify-center"
          aria-label="Adicionar nova antropometria"
          role="button"
        >
          <Plus className="w-8 h-8 mb-2" />
          <p className="text-base font-semibold select-none">Nova Antropometria</p>
        </Card>

        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogContent className="max-w-lg sm:max-w-xl mx-auto rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Cadastrar Nova Antropometria
              </DialogTitle>
            </DialogHeader>
            <AddAnthropometryForm
              user={user}
              onSuccess={() => {
                router.refresh();
                setOpenAddModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Lista de Registros */}
        {anthropometry.length > 0 ? (
          anthropometry.map((data) => (
            <Card
              key={data.id}
              className="relative rounded-2xl border shadow-sm hover:shadow-md transition bg-card cursor-pointer"
              tabIndex={0}
              aria-label={`Detalhes da antropometria ${data.id.slice(0, 6)}`}
              role="button"
            >
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Registro em {formatDate(data.dateExam)}
                </h3>

                <div className="space-y-1">
                  {renderMeasure("Altura:", data.height)}
                  {renderMeasure("Peso:", data.weight)}
                  {renderMeasure("Tórax:", data.chest)}
                  {renderMeasure("Ombro:", data.shoulder)}
                  {renderMeasure("Braço D:", data.rightArm)}
                  {renderMeasure("Braço E:", data.leftArm)}
                  {renderMeasure("Cintura:", data.waist)}
                  {renderMeasure("Coxa D:", data.rightLeg)}
                  {renderMeasure("Coxa E:", data.leftLeg)}
                  {renderMeasure("Pant. D:", data.rightCalf)}
                  {renderMeasure("Pant. E:", data.leftCalf)}
                </div>

                {data.notes && (
                  <div className="pt-3 border-t text-sm text-muted-foreground italic">
                    <strong>Notas:</strong> {data.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground border border-dashed rounded-xl bg-muted/30 p-8">
            Nenhuma antropometria encontrada.
          </div>
        )}
      </section>
    </div>
  );
}
