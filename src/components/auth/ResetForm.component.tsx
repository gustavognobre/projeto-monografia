"use client";
import * as z from "zod";
import React, { useState, useTransition } from "react";
import { CardWrapper } from "@/components/ui/CardWrapper.component";

import { ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/reset";

export const ResetForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });
    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            reset(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            });
        });
    };
    return (
        <CardWrapper
            headerLabel="Esqueceu sua senha?"
            headerText=""
            backButtonLabel="Voltar para o Login"
            backButtonHref="/auth/login"
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
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        variant={"outline"}
                        className="w-full h-12 bg-blue-600 mb-4 text-white"
                    >
                        Enviar e-mail de recuperação
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
