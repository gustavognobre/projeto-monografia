export const Settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Não autorizado!" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Não autorizado!" };
    }

    // Se o usuário está tentando alterar a senha
    if (values.newPassword) {
        // Verifica se a senha antiga foi fornecida
        if (!values.password) {
            return { error: "Para alterar a senha, informe sua senha atual!" };
        }

        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
        if (!passwordMatch) {
            return { error: "Senha incorreta!" };
        }

        // Criptografa a nova senha
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword; // Atualiza a senha no DB
        values.newPassword = undefined; // Limpa o campo newPassword após criptografá-la
    } else {
        // Se o usuário não forneceu uma nova senha, não precisamos alterar a senha
        values.password = undefined;
        values.newPassword = undefined;
    }

    // Filtra os campos undefined ou nulos antes de fazer a atualização no banco
    const updatedData: Partial<z.infer<typeof SettingsSchema>> = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(updatedData).length === 0) {
        return { error: "Nenhuma alteração válida foi enviada." };
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: updatedData,
    });

    return { success: "Configurações atualizadas!" };
};
