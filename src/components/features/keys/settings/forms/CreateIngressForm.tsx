'use client'

import { Button } from "@/src/components/ui/common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/common/Dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/common/Select"
import { useCreateIngressMutation } from "@/src/graphql/generated/output"
import { useCurrent } from "@/src/hooks/useCurrent"
import { createIngressSchema, IngressType, type TypeCreateIngressSchema } from "@/src/schemas/stream/create-ingress.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateIngressForm() {
    const t = useTranslations('dashboard.keys.createModal')

    const [isOpen, setIsOpen] = useState(false)
    const { refetch } = useCurrent()

    const form = useForm<TypeCreateIngressSchema>({
        resolver: zodResolver(createIngressSchema),
        defaultValues: {
            ingressType: IngressType.RTMP
        }
    })

    const [create, {loading: isLoadingCreate}] = useCreateIngressMutation({
        onCompleted(){
            setIsOpen(false)
            refetch()
            toast.success(t('successMessage'))
        },
        onError(){
            toast.error(t('errorMessage'))
        }
    })

    const {isValid} = form.formState

    function onSubmit(data: TypeCreateIngressSchema) {
        create({variables: {ingressType:data.ingressType}})
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
                        <FormField control={form.control} name='ingressType' render={({field}) =>
                            (
                                <FormItem>
                                    <FormLabel>{t('ingressTypeLabel')}</FormLabel>
                                    <FormControl >
                                        <Select onValueChange={value => 
                                            {
                                                field.onChange(Number(value))
                                            }}
                                            defaultValue={field.value.toString()}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('ingressTypePlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                    <SelectItem value={IngressType.RTMP.toString()} disabled={isLoadingCreate}>
                                                        RTMP
                                                    </SelectItem>
                                                    <SelectItem value={IngressType.WHIP.toString()} disabled={isLoadingCreate}>
                                                        WHIP
                                                    </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        {t('ingressTypeDescription')}
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