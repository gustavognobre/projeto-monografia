import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "E-mail inválido!",
    }),
    password: z.string().min(8, { message: "Senha inválida!" }),
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
        photo: z
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
