"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MedicoForm from "@/components/medical/MedicalForm.components";

export default function TermsOfUse() {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setAccepted(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold px-10 py-5 rounded-full shadow-xl transition-all duration-300">
          Quero fazer parte
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-blue-200 bg-blue-50 shadow-xl px-8 py-6 text-blue-900 animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-center mb-4 text-blue-800">
            {accepted ? "Cadastro do Médico" : "Termos de Uso"}
          </DialogTitle>
        </DialogHeader>

        {!accepted ? (
          <>
            <div className="space-y-4 text-justify text-[15px] leading-relaxed mb-6">
              <p>
                Este sistema foi desenvolvido para auxiliar médicos no acompanhamento clínico de pacientes com obesidade e síndrome metabólica...
              </p>
              <p>
                Ao utilizar este sistema, o profissional de saúde se compromete a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizar os dados exclusivamente para fins médicos;</li>
                <li>Respeitar a LGPD;</li>
                <li>Não compartilhar sem autorização;</li>
                <li>Manter os dados atualizados.</li>
              </ul>
              <p className="font-semibold text-blue-700">
                Ao prosseguir, você declara ter lido, compreendido e aceitado os termos acima.
              </p>
            </div>
            <DialogFooter>
              <Button
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-full"
                onClick={() => setAccepted(true)}
              >
                Aceitar e Continuar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <MedicoForm onClose={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
