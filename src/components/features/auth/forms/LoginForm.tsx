'use client'

import { loginSchema, TypeLoginSchema } from "@/src/schemas/auth/login.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ApolloError } from "@apollo/client"
import { useLoginUserMutation } from "@/src/graphql/generated/output"
import { AuthWrapper } from "../AuthWrapper"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Button } from "@/src/components/ui/common/Button"
import { Form } from "@/src/components/ui/common/Form"
import { useRouter } from "next/navigation"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/common/InputOTP"
import Link from "next/link"
import { useAuth } from "@/src/hooks/useAuth"

export default function LoginForm() {
    const t = useTranslations('auth.login')

    const { auth } = useAuth()
    
    const router = useRouter()

    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)

    const form = useForm<TypeLoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            login: "",
            password: ""
        }
    })

    const [login, { loading: isLoadingLogin }] = useLoginUserMutation({
        onCompleted(data) {
            if (data.loginUser.user) {
                toast.success(t('successMessage'))
                router.push('/dashboard/settings')
            } 
            else if (data.loginUser.message) {
                auth()
                setIsShowTwoFactor(true)
                toast.info(data.loginUser.message) 
            }
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    });

    function onSubmit(data: TypeLoginSchema) {
        login({ variables: { data } })
    }


    return(
        <AuthWrapper
            heading={t("heading")}
            backButtonLabel={t("backButtonLabel")}
            backButtonHref="/account/create"
        >
            <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-y-3"
                        >
                            {isShowTwoFactor ? (
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
                                    name="login"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("loginLabel")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="johndoe" disabled={isLoadingLogin} {...field} />
                                            </FormControl>
                                            <FormDescription>{t("loginDescription")}</FormDescription>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel>
                                                        {t('passwordLabel')}
                                                    </FormLabel>
                                                    <Link href='/account/recovery' className="ml-auto inline-block text-sm">
                                                        {t('forgotPassword')}
                                                    </Link>
                                                </div>
                                                <FormControl>
                                                    <Input placeholder="********" disabled={isLoadingLogin} {...field} />
                                                </FormControl>
                                                <FormDescription>{t("passwordDescription")}</FormDescription>
                                            </FormItem>
                                        )}
                                    />
                            </>}
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                disabled={!form.formState.isValid || isLoadingLogin}
                            >
                                {t("submitButton")}
                            </Button>
                        </form>
                    </Form>
        </AuthWrapper>
    )
}