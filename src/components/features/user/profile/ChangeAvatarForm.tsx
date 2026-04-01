'use client'

import { useApolloClient } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/src/components/ui/common/Button"
import { Form, FormField } from "@/src/components/ui/common/Form"
import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { ChannelAvatar } from "@/src/components/ui/elements/ChannelAvatar"
import { FormWrapper } from "@/src/components/ui/elements/FormWrapper"
import { useChangeProfileAvatarMutation, useRemoveProfileAvatarMutation } from "@/src/graphql/generated/output"
import { useCurrent } from "@/src/hooks/useCurrent"
import { type TypeUploadFileSchema, uploadFileSchema } from "@/src/schemas/upload-file.schema"
import { Trash } from "lucide-react"
import { ConfirmModal } from "@/src/components/ui/elements/ConfirmModal"

export function ChangeAvatarForm() {
    const t = useTranslations('dashboard.settings.profile.avatar')
    const client = useApolloClient()
    const { user, isLoadingProfile, refetch } = useCurrent()
    
    const [displayAvatar, setDisplayAvatar] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<TypeUploadFileSchema>({
        resolver: zodResolver(uploadFileSchema),
        defaultValues: { file: undefined }
    })

    const [update, {loading: isLoadingUpdate}] = useChangeProfileAvatarMutation({
        onCompleted: async (data) => {
            refetch()
            toast.success(t('successUpdateMessage'))
        },
        onError: (error) => {
            toast.error(t('errorUpdateMessage'))
        }
    })

    const [remove, {loading: isLoadingRemove}] = useRemoveProfileAvatarMutation({
        onCompleted: async () => {
            setDisplayAvatar(null)   
            refetch()
            toast.success(t('successRemoveMessage'))
        },
        onError: () => {
            toast.error(t('errorRemoveMessage'))
        }
        })

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            setIsUploading(true)
            const previewUrl = URL.createObjectURL(file)
            setDisplayAvatar(previewUrl)
            update({ variables: { avatar: file } })
        }
    }

    return isLoadingProfile ? (
        <ChangeAvatarFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <FormField control={form.control} name="file" render={() => (
                    <div className="px-5 pb-5">
                        <div className="w-full items-center space-x-6 lg:flex">
                            <ChannelAvatar
                                channel={{
                                    username: user?.username ?? '',
                                    avatar: displayAvatar ?? user?.avatar ?? null
                                }}
                                size="xl"
                            />
                            <div className="space-y-3">
                                <div className="flex items-center gap-x-3">
                                    <input 
                                        className="hidden" 
                                        type="file" 
                                        accept="image/*" 
                                        ref={inputRef} 
                                        onChange={handleImageChange} 
                                    />
                                    <Button 
                                        variant='secondary' 
                                        onClick={() => inputRef.current?.click()} 
                                        disabled={isLoadingUpdate || isLoadingRemove}
                                    >
                                        {t('updateButton')}
                                    </Button>
                                    {user?.avatar && (
                                        <ConfirmModal heading={t('confirmModal.heading')} message={t('confirmModal.message')} onConfirm={() => remove()}>
                                            <Button variant='ghost' size='lgIcon' disabled={isLoadingUpdate || isLoadingRemove}>
                                                <Trash className="size-4 " />
                                            </Button>
                                        </ConfirmModal>
                                    )}
                                </div>
                                <p className="text-sm text-(--muted-foreground)">{t('info')}</p>
                            </div>
                        </div>
                    </div>
                )} />
            </Form>
        </FormWrapper>
    )
}

export function ChangeAvatarFormSkeleton() {
    return <Skeleton className="h-52 w-full" />
}
