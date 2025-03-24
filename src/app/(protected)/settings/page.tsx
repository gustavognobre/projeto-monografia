"use client";

import * as z from "zod";
import { Settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/popup/FormError.component";
import { FormSuccess } from "@/components/popup/FormSuccess.component";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            newPassword: "",
            isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
        },
    });

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        // Verifica se as senhas foram preenchidas corretamente
        if (values.password && !values.newPassword) {
            setError("Necessário preencher uma nova senha!");
            return;
        }

        if (values.newPassword && !values.password) {
            setError("Necessário preencher a senha antiga!");
            return;
        }

        startTransiction(() => {
            Settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }
                    if (data.success) {
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError("Alguma coisa não esta certa!"));
        });
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p>Configurações</p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Novo Nome"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {user?.isOAuth === false && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>E-mail</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Novo Email"
                                                        type="email"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="********"
                                                        type="password"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nova Senha</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="********"
                                                        type="password"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isTwoFactorEnabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Autenticação de dois fatores
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Por segurança, recomendamos ativá-la para
                                                        sua conta!
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        disabled={isPending}
                                                        checked={field.value ?? false} // Garante que nunca será undefined
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked); // Atualiza corretamente o valor
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button disabled={isPending} type="submit">
                            Salvar
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
