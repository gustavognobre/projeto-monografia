"use client";
import * as z from "zod";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "@/components/ui/CardWrapper.component";

import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            dateBirth: "",
            gender: undefined,
            image: "",
        },
    });
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            register(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };
    return (
        <CardWrapper
            headerLabel="Vamos Começar!"
            headerText="Faça um novo acesso e descubra uma nova maneira de cuidar de você!"
            backButtonLabel="Já possui uma conta?"
            backButtonHref="/auth/login"
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirme sua senha</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                        placeholder="John Dow"
                                        aria-label="Qual seu nome"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dateBirth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de nascimento</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                        placeholder=""
                                        aria-label="Sua Data de Nascimento"
                                        type="date"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gênero</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        {...field}
                                        value={field.value} // Passando o valor atual do campo
                                        onValueChange={field.onChange} // Atualiza o valor quando um botão é selecionado
                                        className="flex justify-center space-x-6" // Ajustado para centralizar e aumentar o espaçamento
                                    >
                                        {/* Masculino */}
                                        <div className="flex items-center">
                                            <RadioGroupItem value="Masculino" id="Masculino" />
                                            <Label htmlFor="Masculino" className="ml-2">
                                                Masculino
                                            </Label>
                                        </div>
                                        {/* Feminino */}
                                        <div className="flex items-center">
                                            <RadioGroupItem value="Feminino" id="Feminino" />
                                            <Label htmlFor="Feminino" className="ml-2">
                                                Feminino
                                            </Label>
                                        </div>
                                        {/* Outro */}
                                        <div className="flex items-center">
                                            <RadioGroupItem value="Outros" id="Outros" />
                                            <Label htmlFor="Outros" className="ml-2">
                                                Outros
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Perfil</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                        aria-label="Sua foto de Perfil"
                                        placeholder="url da sua foto de perfil"
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
