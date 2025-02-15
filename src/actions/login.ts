"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFilds = LoginSchema.safeParse(values);

    if (!validatedFilds.success) {
        return { error: "Algum Problema com e-mail ou senha!" };
    }

    return { success: "E-mail enviado" };
};
