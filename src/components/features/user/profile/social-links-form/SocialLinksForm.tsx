'use client'

import { Button } from "@/src/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Separator } from "@/src/components/ui/common/Separator"
import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { FormWrapper } from "@/src/components/ui/elements/FormWrapper"
import { useCreateSocialLinkMutation, useFindSocialLinksQuery } from "@/src/graphql/generated/output"
import { socialLinksSchema, type TypeSocialLinksSchema } from "@/src/schemas/user/social-links.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { SocialLinksList } from "./SocialLinksList"

export function SocialLinksForm() {
    const t = useTranslations('dashboard.settings.profile.socialLinks.createForm')
    
    const { loading: isLoadingLinks, refetch } = useFindSocialLinksQuery()

    const form = useForm<TypeSocialLinksSchema>({
        resolver: zodResolver(socialLinksSchema),
        defaultValues: {
            title: '',
            url: ''
        }
    })

    
    const [create, {loading: isLoadingCreate}] = useCreateSocialLinkMutation({
        onCompleted: async (data) => {
            form.reset()
            refetch()
            toast.success(t('successMessage'))
        },
        onError: (error) => {
            toast.error(t('errorMessage'))
        }
    })
    
    const { isValid } = form.formState

    function onSubmit(data: TypeSocialLinksSchema) {
        create( {variables: {data} })
    }


    return isLoadingLinks ? 
    (
        <SocialLinksFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-y-3"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="px-5">
                                        <FormLabel>{t("titleLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('titlePlaceholder')} disabled={isLoadingCreate} {...field} />
                                        </FormControl>
                                        <FormDescription>{t("titleDescription")}</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem className="px-5 pb-3">
                                        <FormLabel>{t("urlLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('urlPlaceholder')} disabled={isLoadingCreate} {...field} />
                                        </FormControl>
                                        <FormDescription>{t("urlDescription")}</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <div className="flex justify-end p-5 ">
                                <Button type="submit" disabled={!isValid || isLoadingCreate}>
                                    {t('submitButton')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <SocialLinksList />
        </FormWrapper>
    )
}

export function SocialLinksFormSkeleton() {
    return (
        <Skeleton className="w-full h-72" />
    )
}