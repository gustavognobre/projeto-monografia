"use server";

import * as z from "zod";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFilds = RegisterSchema.safeParse(values);

    if (!validatedFilds.success) {
        return { error: "Algum Problema com e-mail ou senha!" };
    }

    const { email, password, name, dateBirth, gender, image } = validatedFilds.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "E-mail já cadastrado!" };
    }

    await db.user.create({
        data: {
            image,
            name,
            email,
            dateBirth,
            gender,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmação de e-mail enviada!" };
};
