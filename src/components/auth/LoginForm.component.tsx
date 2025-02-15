"use client";
import * as z from "zod";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "@/components/ui/CardWrapper.component";

import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "@/components/popup/FormError.component";
import { FormSuccess } from "@/components/popup/FormSuccess.component";
import { login } from "@/actions/login";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };
    return (
        <CardWrapper
            headerLabel="Bem-vindo de volta!"
            headerText="Faça um novo acesso e descubra uma nova maneira de cuidar de você!"
            backButtonLabel="Ainda não tem uma conta?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="john.dow@example.com"
                                        type="email"
                                        className="h-12"
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
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                        placeholder="********"
                                        aria-label="Digite sua senha"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        variant={"outline"}
                        className="w-full h-12 bg-blue-600 mb-4 text-white"
                    >
                        Entrar
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
