import { Button } from "@/src/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Separator } from "@/src/components/ui/common/Separator"
import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { useChangePasswordMutation } from "@/src/graphql/generated/output"
import { useCurrent } from "@/src/hooks/useCurrent"
import { changePasswordSchema, type TypeChangePasswordSchema } from "@/src/schemas/user/change-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


export function ChangePasswordForm() {
    const t = useTranslations('dashboard.settings.account.password')
    const { isLoadingProfile, refetch } = useCurrent()

    const form = useForm<TypeChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        values: {
            oldPassword: '',
            newPassword: ''
        }
    })

    const [update, { loading: isLoadingUpdate }] = useChangePasswordMutation({
        onCompleted: () => {
            refetch()
            form.reset() 
            toast.success(t('successMessage'))
        },
        onError: () => {
            toast.error(t('errorMessage'))
        }
    })
    
    const { isValid } = form.formState

    function onSubmit(data: TypeChangePasswordSchema) {
        update({ variables: { data } })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-y-3"
            >
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem className="px-5">
                            <FormLabel>{t("oldPasswordLabel")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="********" 
                                    type="password"
                                    disabled={isLoadingUpdate} 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>{t("oldPasswordDescription")}</FormDescription>
                        </FormItem>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem className="px-5">
                            <FormLabel>{t("newPasswordLabel")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="********" 
                                    type="password"
                                    disabled={isLoadingUpdate} 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>{t("newPasswordDescription")}</FormDescription>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end p-5">
                    <Button
                        type="submit" 
                        disabled={!isValid || isLoadingUpdate}
                    >
                        {t('submitButton')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}


export function ChangePasswordFormSkeleton( ) {
    return (
        <Skeleton className="w-full h-96" />
    )
}