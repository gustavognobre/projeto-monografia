import * as z from "zod";
export const SettingsSchema = z
    .object({
        name: z.string().optional(),
        isTwoFactorEnabled: z.boolean().optional(),
        email: z.string().email().optional(),
        password: z
            .string()
            .min(8, { message: "A senha precisa ter pelo menos 8 caracteres!" })
            .optional(),
        newPassword: z
            .string()
            .min(8, { message: "A nova senha precisa ter pelo menos 8 caracteres!" })
            .optional(),
    })
    .refine(
        (data) => {
            // Se a senha antiga foi preenchida, a nova senha deve ser preenchida também
            if (data.password && !data.newPassword) {
                return false;
            }
            return true;
        },
        {
            message: "Necessário preencher uma nova senha!",
            path: ["newPassword"],
        }
    )
    .refine(
        (data) => {
            // Se a nova senha foi preenchida, a senha antiga deve ser preenchida também
            if (data.newPassword && !data.password) {
                return false;
            }
            return true;
        },
        {
            message: "Necessário preencher a senha antiga!",
            path: ["password"],
        }
    );


export const NewPasswordSchema = z.object({
    password: z.string().min(8, { message: "Senha inválida!" }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "E-mail inválido!",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "E-mail inválido!",
    }),
    password: z.string().min(8, { message: "Senha inválida!" }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z
    .object({
        email: z.string().email({
            message: "E-mail inválido!",
        }),
        name: z.string().min(1, {
            message: "O nome é obrigatório.",
        }),
        dateBirth: z.string({
            required_error: "A data de nascimento é obrigatória.",
        }),
        gender: z.enum(["Masculino", "Feminino", "Outros"], {
            required_error: "Por favor, selecione seu gênero.",
        }),
        image: z
            .string()
            .optional() // Foto é opcional
            .refine((value) => value !== undefined, { message: "Adicione uma URL." }),
        password: z.string().min(8, { message: "Senha inválida!" }),
        // password: z
        // .string()
        // .min(8, {
        //     message: "A senha deve ter no mínimo 8 caracteres.",
        // })
        // .regex(/[A-Z]/, {
        //     message: "A senha deve conter pelo menos uma letra maiúscula.",
        // })
        // .regex(/[a-z]/, {
        //     message: "A senha deve conter pelo menos uma letra minúscula.",
        // })
        // .regex(/[0-9]/, {
        //     message: "A senha deve conter pelo menos um número.",
        // })
        // .regex(/[\W_]/, {
        //     message: "A senha deve conter pelo menos um caractere especial.",
        // }),
        confirmPassword: z.string().min(8, {
            message: "A confirmação da senha é obrigatória.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não correspondem.",
        path: ["confirmPassword"],
    });
