import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "E-mail inválido!",
  }),
  password: z.string().min(8, { message: "Senha inválida!" }),
});
