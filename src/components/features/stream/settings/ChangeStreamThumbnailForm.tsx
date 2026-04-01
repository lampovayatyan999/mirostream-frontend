import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { FindChannelByUsernameQuery, useChangeStreamThumbnailMutation, useRemoveStreamThumbnailMutation } from '@/src/graphql/generated/output';
import { useTranslations } from 'next-intl';
import { useCurrent } from '@/src/hooks/useCurrent';
import { TypeUploadFileSchema, uploadFileSchema } from '@/src/schemas/upload-file.schema';
import { getMediaSource } from '@/src/utils/get-media-source';
import { toast } from 'sonner';
import { Form, FormField, FormItem } from '@/src/components/ui/common/Form';
import { ChannelAvatar } from '@/src/components/ui/elements/ChannelAvatar';
import { Card } from '@/src/components/ui/common/Card';
import { Button } from '@/src/components/ui/common/Button';
import { ConfirmModal } from '@/src/components/ui/elements/ConfirmModal';

interface ChangeStreamThumbnailFormProps {
    stream: FindChannelByUsernameQuery['findChannelByUsername']['stream'];
}

export function ChangeStreamThumbnailForm({ stream }: ChangeStreamThumbnailFormProps) {
    const t = useTranslations('stream.settings.thumbnail');
    const { user } = useCurrent();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<TypeUploadFileSchema>({
        resolver: zodResolver(uploadFileSchema),
        values: {
            file: getMediaSource(stream?.thumbnailUrl!)
        }
    });

    
    const [update, { loading: isLoadingUpdate }] = useChangeStreamThumbnailMutation({
        onCompleted() {
            toast.success(t('successUpdateMessage'));
        },
        onError() {
            toast.error(t('errorUpdateMessage'));
        }
    });

    
    const [remove, { loading: isLoadingRemove }] = useRemoveStreamThumbnailMutation({
        onCompleted() {
            toast.success(t('successRemoveMessage'));
        },
        onError() {
            toast.error(t('errorRemoveMessage'));
        }
    });

    
    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            form.setValue('file', file);
            update({ variables: { thumbnail: file } });
        }
    }

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center space-x-6">
                            {stream?.thumbnailUrl ? (
                                <Image
                                    src={
                                        field.value instanceof File
                                            ? URL.createObjectURL(field.value)
                                            : field.value!
                                    }
                                    alt={stream.title}
                                    width={190}
                                    height={80}
                                    className="aspect-video rounded-lg object-cover"
                                />
                            ) : (
                                <Card className="flex h-28 w-full flex-col items-center justify-center rounded-lg">
                                    <ChannelAvatar channel={user!} />
                                </Card>
                            )}

                            <div className="flex w-full items-center gap-x-3">
                                <input
                                    className="hidden"
                                    type="file"
                                    ref={inputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    disabled={isLoadingUpdate || isLoadingRemove}
                                >
                                    {t('updateButton')}
                                </Button>

                                {stream?.thumbnailUrl && (
                                    <ConfirmModal
                                        heading={t('confirmModal.heading')}
                                        message={t('confirmModal.message')}
                                        onConfirm={() => remove()}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            disabled={isLoadingUpdate || isLoadingRemove}
                                        >
                                            <Trash className="size-4" />
                                        </Button>
                                    </ConfirmModal>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('info')}
                        </p>
                    </FormItem>
                )}
            />
        </Form>
    );
}