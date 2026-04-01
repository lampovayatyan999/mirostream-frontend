'use client'

import { Button } from "@/src/components/ui/common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/common/Dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { Textarea } from "@/src/components/ui/common/Textarea"
import { useCreateSponsorshipPlanMutation, useFindMySponsorshipPlansQuery, useFindMySponsorsQuery } from "@/src/graphql/generated/output"
import { createPlanSchema, type TypeCreatePlanSchema } from "@/src/schemas/plan/create-plan.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export function CreatePlanForm() {
    const t = useTranslations('dashboard.plans.createForm')

    const [isOpen, setIsOpen] = useState(false)
    const { refetch } = useFindMySponsorshipPlansQuery()

    const form = useForm<z.infer<typeof createPlanSchema>>({
        resolver: zodResolver(createPlanSchema) as any,
        defaultValues: {
            title: '',
            description: '',
            price: 0
        }
    })

    const [create, { loading: isLoadingCreate }] = useCreateSponsorshipPlanMutation({
        onCompleted() {
            setIsOpen(false)
            form.reset()
            refetch()
            toast.success(t('successMessage'))
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    })

    const { isValid } = form.formState

    const onSubmit: SubmitHandler<TypeCreatePlanSchema> = (data) => {
        create({ variables: { data } })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>{t('trigger')}</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('heading')}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('titleLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('titlePlaceholder')}
                                            disabled={isLoadingCreate}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('titleDescription')}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('descriptionLabel')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('descriptionPlaceholder')}
                                            disabled={isLoadingCreate}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('descriptionDescription')}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('priceLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('priceLabel')}
                                            type="number"
                                            disabled={isLoadingCreate}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('priceDescription')}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={!isValid || isLoadingCreate}>
                                {t('submitButton')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}