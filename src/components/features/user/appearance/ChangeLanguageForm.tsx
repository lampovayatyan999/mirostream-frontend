'use client'

import { Form, FormField } from "@/src/components/ui/common/Form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/common/Select"
import { CardContainer } from "@/src/components/ui/elements/CardContainer"
import { setLanguage } from "@/src/libs/i18n/language"
import { changeLanguageSchema, type TypeChangeLanguageSchema } from "@/src/schemas/user/change-language.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const languages = {
    ru: 'Русский',
    en: 'English',
    ja: 'Japanese'
}

export function ChangeLanguageForm() {
    const t = useTranslations('dashboard.settings.appearance.language')
    
    const [isPending, startTransition ] = useTransition()
    const locale = useLocale()

    const form = useForm<TypeChangeLanguageSchema>({
        resolver: zodResolver(changeLanguageSchema),
        values: {
            language: locale as TypeChangeLanguageSchema['language']
        }
    })

    function onSubmit(data: TypeChangeLanguageSchema) {
        startTransition(async () => {
            try {
                const result = await setLanguage(data.language)
                
                if (result.success) {
                    toast.success(t('successMessage'))
                    window.location.reload()
                }
            } catch (error) {
                toast.error("Error changing language")
            }
        })
    }

    return (
        <CardContainer heading={t('heading')} description={t('description')} rightContent={<Form {...form}>
                <FormField control={form.control} name='language' render={({field}) => (
                    <Select onValueChange={value => {
                        field.onChange(value)
                        form.handleSubmit(onSubmit)()
                    }}
                    value={field.value}
                    >
                        <SelectTrigger className="w-45">
                            <SelectValue placeholder={t('selectPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {Object.entries(languages).map(([code, name]) => (
                                <SelectItem key={code} value={code} disabled={isPending}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )} 
                />
        </Form>} />
    )
}