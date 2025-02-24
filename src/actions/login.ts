"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFilds = LoginSchema.safeParse(values);

    if (!validatedFilds.success) {
        return { error: "Algum Problema com e-mail ou senha!" };
    }

    const { email, password } = validatedFilds.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Seu e-mail ainda n foi cadastrado!" };
    }
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "E-mail de confirmação enviado!" };
    }

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
