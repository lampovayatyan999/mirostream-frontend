'use client'


import { useResetPasswordMutation } from "@/src/graphql/generated/output"
import { resetPasswordSchema, TypeResetPasswordSchema } from "@/src/schemas/auth/reset-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import {  useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/common/Alert"
import { CircleCheck } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Button } from "@/src/components/ui/common/Button"

export function ResetPasswordForm () {
    const t = useTranslations('auth.register')
    const [isSuccess, setIsSuccess] = useState(false)


    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        }
    })

    const [resetPassword, { loading: isLoadingReset }] = useResetPasswordMutation(
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

    function onSubmit(data: TypeResetPasswordSchema) {
        resetPassword({variables: { data } })
    }

    return (
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("emailLabel")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@.com" disabled={isLoadingReset} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("emailDescription")}</FormDescription>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            disabled={!form.formState.isValid || isLoadingReset}
                        >
                            {t("submitButton")}
                        </Button>
                    </form>
                </Form>
            )}
        </AuthWrapper>
    )
}