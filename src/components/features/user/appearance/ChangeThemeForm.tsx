'use client'

import { Form, FormField } from "@/src/components/ui/common/Form"
import { ToggleCard } from "@/src/components/ui/elements/ToggleCard"
import { changeThemeSchema, TypeChangeThemeSchema } from "@/src/schemas/user/change-theme.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ChangeThemeForm() {
    const t = useTranslations('dashboard.settings.appearance.theme')

    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    const form = useForm<TypeChangeThemeSchema>({
        resolver: zodResolver(changeThemeSchema),
        values: {
            theme: theme === 'dark' ? 'dark' : 'light'
        }
    })

    if (!mounted) return null

    function onChange(value: boolean) {
        const newTheme = value ? 'dark' : "light"

        setTheme(newTheme)
        form.setValue('theme', newTheme)
        toast.success(t('successMessage'))
    }

    return (
        <Form {...form}>
            <FormField control={form.control} name="theme" render={({field}) => (
                <ToggleCard heading={t('heading')} description={t('description')} value={field.value === 'dark'} onChange={onChange} />
            )} />
        </Form>
    )
}