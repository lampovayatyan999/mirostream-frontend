'use client'

import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWrapper";
import { createAccountSchema, TypeCreateAccountSchema } from "@/src/schemas/auth/create-account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form";
import { Input } from "@/src/components/ui/common/Input";
import { Button } from "@/src/components/ui/common/Button";
import { toast } from "sonner"; 
import {  useCreateUserMutation } from "@/src/graphql/generated/output";
import { useState, useEffect } from "react"; 
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/common/Alert";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export function CreateAccountForm() {
    const t = useTranslations('auth.register')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isMounted, setIsMounted] = useState(false) 

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm<TypeCreateAccountSchema>({
        resolver: zodResolver(createAccountSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const [create, { loading: isLoadingCreate }] = useCreateUserMutation(
        {
            onCompleted() {
                setIsSuccess(true)
            },
            onError(error) {
                console.error("Mutation error:", error);
                toast.error(t("errorMessage"));
            },
        }
    );

    function onSubmit(data: TypeCreateAccountSchema) {
        create({ variables: { data } })
    }

    if (!isMounted) {
        return null 
    }

    return (
        <main className="h-screen">
            <AuthWrapper 
                heading={t("heading")}
                backButtonLabel={t("backButtonLabel")}
                backButtonHref="/account/login"
            >
                {isSuccess ? (
                    <Alert>
                        <CircleCheck className="size-4" />
                        <AlertTitle>{t("successAlertTitle")}</AlertTitle>
                        <AlertDescription>
                            {t("successAlertDescription")}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-y-3"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("usernameLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john" disabled={isLoadingCreate} {...field} />
                                        </FormControl>
                                        <FormDescription>{t("usernameDescription")}</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("emailLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@.com" disabled={isLoadingCreate} {...field} />
                                        </FormControl>
                                        <FormDescription>{t("emailDescription")}</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("passwordLabel")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="********"
                                                type="password"
                                                disabled={isLoadingCreate}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>{t("passwordDescription")}</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                disabled={!form.formState.isValid || isLoadingCreate}
                            >
                                {t("submitButton")}
                            </Button>
                        </form>
                    </Form>
                )}
            </AuthWrapper>
        </main>
    )
}