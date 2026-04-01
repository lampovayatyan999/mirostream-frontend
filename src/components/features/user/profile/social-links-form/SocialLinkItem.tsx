import { Button } from "@/src/components/ui/common/Button"
import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/common/Form"
import { Input } from "@/src/components/ui/common/Input"
import { useFindSocialLinksQuery, useRemoveSocialLinkMutation, useUpdateSocialLinkMutation, type FindSocialLinksQuery } from "@/src/graphql/generated/output"
import { type TypeSocialLinksSchema, socialLinksSchema } from "@/src/schemas/user/social-links.schema"
import type { DraggableProvided } from "@hello-pangea/dnd"
import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SocialLinkItemProps {
    socialLink: FindSocialLinksQuery['findSocialLinks'][0]
    provided: DraggableProvided
}

export function SocialLinkItem({ socialLink, provided }: SocialLinkItemProps) {
    const t = useTranslations('dashboard.settings.profile.socialLinks.editForm')

    const [editingId, setIsEditingId] = useState<string | null>(null)

    const { refetch } = useFindSocialLinksQuery()

    const form = useForm<TypeSocialLinksSchema>({
        resolver: zodResolver(socialLinksSchema),
        values: {
            title: socialLink.title ?? '',
            url: socialLink.url ?? ''
        }
    })

    const { isDirty, isValid } = form.formState

    function toggleEditing(id: string | null) {
        setIsEditingId(id)
    }

    const [update, { loading: isLoadingUpdate }] = useUpdateSocialLinkMutation({
        onCompleted() {
            toggleEditing(null)
            refetch() 
            toast.success(t('successUpdateMessage'))
        },
        onError() {
            toast.error(t('errorUpdateMessage'))
        }
    })

    const [remove, { loading: isLoadingRemove }] = useRemoveSocialLinkMutation({
        onCompleted() {
            refetch()
            toast.success(t('successRemoveMessage'))
        },
        onError() {
            toast.error(t('errorRemoveMessage'))
        }
    })

    function onSubmit(data: TypeSocialLinksSchema) {
        update({ variables: { id: socialLink.id, data } })
    }

    return (
        <div
            className="mb-4 flex items-center gap-x-2 rounded-md border border-(--border) bg-(--background) text-sm"
            ref={provided.innerRef}
            {...provided.draggableProps}
        >   
            <div 
                className="rounded-l-md border-r border-r-border px-2 py-9 text-(--foreground) transition hover:bg-(--accent) cursor-grab active:cursor-grabbing" 
                {...provided.dragHandleProps} 
            >
                <GripVertical className="size-5" />
            </div>

            <div className="flex-1 px-2">
                {editingId === socialLink.id ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex items-center gap-x-6"
                        >
                            <div className="w-96 space-y-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className="h-8" placeholder='Youtube' disabled={isLoadingUpdate || isLoadingRemove} {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className="h-8" placeholder='URL' {...field} disabled={isLoadingUpdate || isLoadingRemove} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-x-4">
                                <Button type="button" onClick={() => toggleEditing(null)} variant='secondary'>
                                    {t('cancelButton')}
                                </Button>
                                <Button type="submit" disabled={!isDirty || !isValid || isLoadingUpdate}>
                                    {t('submitButton')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : ( 
                    <>
                        <h2 className="text-[17px] tracking-normal font-semibold text-(--foreground)">
                            {socialLink.title}
                        </h2>
                        <p className="text-(--muted-foreground)">{socialLink.url}</p>
                    </>
                )}
            </div>

            <div className="ml-auto flex items-center gap-x-2 pr-4">
                {editingId !== socialLink.id && (
                    <Button onClick={() => toggleEditing(socialLink.id)} variant='ghost' size='lgIcon'>
                        <Pencil className="size-4 text-(--muted-foreground)" />
                    </Button>
                )}
                <Button 
                    onClick={() => remove({ variables: { id: socialLink.id } })} 
                    variant='ghost' 
                    size='lgIcon' 
                    className="hover:text-(--destructive)"
                    disabled={isLoadingRemove}
                >
                    <Trash2 className="size-4 text-(--muted-foreground)" />
                </Button>
            </div>
        </div>
    )
}
