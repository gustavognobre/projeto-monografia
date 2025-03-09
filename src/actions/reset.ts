"use server";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFilds = ResetSchema.safeParse(values);

    if (!validatedFilds.success) {
        return { error: "E-mail inválido!" };
    }

    const { email } = validatedFilds.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "E-mail não cadastrado" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
    return { success: "E-mail de recuperação enviado!" };
};
