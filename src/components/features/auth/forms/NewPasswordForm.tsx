'use client'

import { useNewPasswordMutation } from "@/src/graphql/generated/output";
import { newPasswordSchema, TypeNewPasswordSchema } from "@/src/schemas/auth/new-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthWrapper } from "../AuthWrapper";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, Form } from "@/src/components/ui/common/Form";
import { Button } from "@/src/components/ui/common/Button";
import { Input } from "@/src/components/ui/common/Input";

export function NewPasswordForm() {
       const t = useTranslations('auth.newPassword')

    const router = useRouter()
    const params = useParams<{ token: string }>();
    const token = params.token; 

    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(newPasswordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            passwordRepeat: ""
        }
    })

    const [newPassword, { loading: isLoadingNewPassword }] = useNewPasswordMutation({
        onCompleted(data) {
            toast.success(t('successMessage'))
            router.push('/account/login')
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    });

    function onSubmit(data: TypeNewPasswordSchema) {
        // Выведем в консоль, чтобы убедиться, что токен существует
        console.log("Токен из URL:", token);

        if (!token) {
            toast.error("Ошибка: Токен отсутствует в URL. Попробуйте перейти по ссылке из письма еще раз.");
            return;
        }

        newPassword({ 
            variables: { 
                data: {
                    password: data.password,
                    passwordRepeat: data.passwordRepeat, 
                    token: token 
                } 
            } 
        });
    }


    return (
        <AuthWrapper
            heading={t("heading")}
            backButtonLabel={t("backButtonLabel")}
            backButtonHref="/account/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-y-3"
                >
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("passwordLabel")}</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" type="password" disabled={isLoadingNewPassword} {...field} />
                                </FormControl>
                                <FormDescription>{t("passwordDescription")}</FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordRepeat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("passwordRepeatLabel")}</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" type="password" disabled={isLoadingNewPassword} {...field} />
                                </FormControl>
                                <FormDescription>{t("passwordRepeatDescription")}</FormDescription>
                            </FormItem>
                        )}
                    />
                            
                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={!form.formState.isValid || isLoadingNewPassword}
                    >
                        {t("submitButton")}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}