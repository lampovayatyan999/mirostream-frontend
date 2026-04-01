'use client'

import { Button } from "@/src/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Separator } from "@/src/components/ui/common/Separator"
import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { Textarea } from "@/src/components/ui/common/Textarea"
import { useChangeEmailMutation } from "@/src/graphql/generated/output"
import { useCurrent } from "@/src/hooks/useCurrent"
import { changeEmailSchema, type TypeChangeEmailSchema } from "@/src/schemas/user/change-email.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ChangeEmailForm() {
    const t = useTranslations('dashboard.settings.account.email')
    const { user, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<TypeChangeEmailSchema>({
        resolver: zodResolver(changeEmailSchema),
        values: {
            email: user?.email ?? ''
        }
    })

    const [update, { loading: isLoadingUpdate }] = useChangeEmailMutation({
        onCompleted: () => {
            refetch()
            form.reset() // Рекомендую сбрасывать состояние dirty после успеха
            toast.success(t('successMessage'))
        },
        onError: () => {
            toast.error(t('errorMessage'))
        }
    })
    
    const { isValid, isDirty } = form.formState

    function onSubmit(data: TypeChangeEmailSchema) {
        update({ variables: { data } })
    }

    if (isLoadingProfile) {
        return <ChangeEmailFormSkeleton />
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-y-3"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="px-5">
                            <FormLabel>{t("emailLabel")}</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="john.doe@example.com" 
                                    disabled={isLoadingUpdate} 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>{t("emailDescription")}</FormDescription>
                        </FormItem>
                    )}
                />
                <Separator />
                <div className="flex justify-end p-5">
                    <Button 
                        type="submit" 
                        disabled={!isValid || !isDirty || isLoadingUpdate}
                    >
                        {t('submitButton')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
export function ChangeEmailFormSkeleton( ) {
    return (
        <Skeleton className="w-full h-64" />
    )
}