"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createAnthropometry } from "@/actions/exam_data";
import { PlusCircle } from "lucide-react";

interface FormValues {
  height:number;
  weight:number;
  chest: number;
  shoulder: number;
  rightArm: number;
  leftArm: number;
  waist: number;
  rightLeg: number;
  leftLeg: number;
  rightCalf: number;
  leftCalf: number;
  notes?: string;
  dateExam: string;

  show?: boolean;
  userId?: string;
}

interface AddAnthropometryFormProps {
  user: { id: string };
  onSuccess: () => void;
}

export default function AddAnthropometryForm({ user, onSuccess }: AddAnthropometryFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { show: true },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("show", "true");

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    await createAnthropometry(formData);

    onSuccess();
    reset();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  // Classe base para inputs com cores primary do tailwind
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base h-10 " +
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <input
        type="number"
        step="any"
        placeholder="Altura (cm)"
        {...register("height", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />      <input
        type="number"
        step="any"
        placeholder="Peso (Kg)"
        {...register("weight", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Tórax (cm)"
        {...register("chest", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Ombro (cm)"
        {...register("shoulder", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Braço Direito (cm)"
        {...register("rightArm", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Braço Esquerdo (cm)"
        {...register("leftArm", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Cintura (cm)"
        {...register("waist", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Coxa Direita (cm)"
        {...register("rightLeg", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Coxa Esquerda (cm)"
        {...register("leftLeg", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Panturrilha Direita (cm)"
        {...register("rightCalf", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Panturrilha Esquerda (cm)"
        {...register("leftCalf", { valueAsNumber: true, required: true })}
        className={inputClass}
        required
      />
      <input
        type="date"
        {...register("dateExam", { required: true })}
        className={inputClass}
        required
      />
      <textarea
        placeholder="Notas (opcional)"
        {...register("notes")}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base resize-none
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg transform hover:scale-105"
   disabled={loading}
   >
   <PlusCircle className="w-5 h-5" />
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
