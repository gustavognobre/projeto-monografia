"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFilds = LoginSchema.safeParse(values);

    if (!validatedFilds.success) {
        return { error: "Algum Problema com e-mail ou senha!" };
    }

    const { email, password } = validatedFilds.data;
    try {
        await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciais inválidas" };
                default:
                    return { error: "Algo esta errado!" };
            }
        }

        throw error;
    }
};
