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
        <div className="flex items-center">
            <Ruler className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
            <strong>{label}</strong>
            <span className="ml-1">{value ?? "-"} cm</span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 pt-24">
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* Card de Adição */}
                <Card
                    className="border-2 border-dashed border-primary-400 hover:bg-primary-50
                     flex flex-col items-center justify-center cursor-pointer transition-shadow
                     rounded-lg shadow-sm hover:shadow-md p-8 text-primary-600"
                    onClick={() => setOpenAddModal(true)}
                    aria-label="Adicionar nova antropometria"
                >
                    <Plus className="w-10 h-10 mb-3" />
                    <p className="text-lg font-semibold select-none">Adicionar Antropometria</p>
                </Card>
                <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
                    <DialogContent className="max-w-lg sm:max-w-xl mx-auto rounded-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
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
                            className="relative rounded-lg border border-gray-200 shadow-sm
                         hover:shadow-lg transition cursor-pointer bg-white"
                            tabIndex={0}
                            role="button"
                            aria-label={`Detalhes da antropometria ${data.id.slice(0, 6)}`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                        Registro em {formatDate(data.dateExam)}
                                    </h3>
                                </div>

                                <div className="gap-x-6 gap-y-3 text-gray-700 text-sm">
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
                                    <div className="mt-4 pt-3 border-t border-gray-100 text-gray-600 text-sm italic">
                                        <strong>Notas:</strong> {data.notes}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 border border-dashed rounded-lg bg-gray-50 p-8">
                        Nenhuma antropometria encontrada.
                    </div>
                )}
            </section>
        </div>
    );
}
