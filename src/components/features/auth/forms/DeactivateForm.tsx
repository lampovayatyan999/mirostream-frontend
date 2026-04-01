'use client'

import { loginSchema, TypeLoginSchema } from "@/src/schemas/auth/login.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useDeactivateAccountMutation, useLoginUserMutation } from "@/src/graphql/generated/output"
import { AuthWrapper } from "../AuthWrapper"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Button } from "@/src/components/ui/common/Button"
import { Form } from "@/src/components/ui/common/Form"
import { useRouter } from "next/navigation"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/common/InputOTP"
import Link from "next/link"
import { useAuth } from "@/src/hooks/useAuth"
import { deactivateSchema, type TypeDeactivateSchema } from "@/src/schemas/auth/deactivate.schema"

export default function DeactivateForm() {
    const t = useTranslations('auth.deactivate')

    const { exit } = useAuth()
    
    const router = useRouter()

    const [isShowConfirm, setIsShowConfirm] = useState(false)

    const form = useForm<TypeDeactivateSchema>({
        resolver: zodResolver(deactivateSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const [deactivate, { loading: isLoadingDeactivate }] = useDeactivateAccountMutation({
        onCompleted(data) {
            if (data.deactivateAccount.user) {
                setIsShowConfirm(true)
            } 
            else {
                exit()
                toast.success(t('successMessage')) 
                router.push('/')
            }
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    });


    function onSubmit(data: TypeDeactivateSchema) {
        deactivate({ variables: { data } })
    }


    return(
        <AuthWrapper
            heading={t("heading")}
            backButtonLabel={t("backButtonLabel")}
            backButtonHref="/dashboard/settings"
        >
            <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-y-3"
                        >
                            {isShowConfirm ? (
                                    <FormField
                                        control={form.control}
                                        name="pin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("pinLabel")}</FormLabel>
                                                <FormControl>
                                                    <InputOTP maxLength={6} {...field}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0}/>
                                                            <InputOTPSlot index={1}/>
                                                            <InputOTPSlot index={2}/>
                                                            <InputOTPSlot index={3}/>
                                                            <InputOTPSlot index={4}/>
                                                            <InputOTPSlot index={5}/>
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormDescription>{t("pinDescription")}</FormDescription>
                                            </FormItem>
                                        )}
                                    />
                            ) : <>
                                    <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("emailLabel")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@gmail.com" disabled={isLoadingDeactivate} {...field} />
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
                                                    <FormLabel>
                                                        {t('passwordLabel')}
                                                    </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="********" disabled={isLoadingDeactivate} {...field} />
                                                </FormControl>
                                                <FormDescription>{t("passwordDescription")}</FormDescription>
                                            </FormItem>
                                        )}
                                    />
                            </>}
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                disabled={!form.formState.isValid || isLoadingDeactivate}
                            >
                                {t("submitButton")}
                            </Button>
                        </form>
                    </Form>
        </AuthWrapper>
    )
}