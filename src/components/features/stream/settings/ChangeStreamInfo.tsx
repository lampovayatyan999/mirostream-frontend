'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FindChannelByUsernameQuery, useChangeStreamInfoMutation, useFindAllCategoriesQuery } from '@/src/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { changeStreamInfoSchema, TypeChangeStreamInfoSchema } from '@/src/schemas/stream/change-stream-info.schema'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/src/components/ui/common/Form'
import { Input } from '@/src/components/ui/common/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/common/Select'
import { Button } from '@/src/components/ui/common/Button'

interface ChangeStreamInfoFormProps {
  stream: FindChannelByUsernameQuery['findChannelByUsername']['stream']
}

export function ChangeStreamInfoForm({ stream }: ChangeStreamInfoFormProps) {
  const t = useTranslations('stream.settings.info')
  const { data } = useFindAllCategoriesQuery()
  const categories = data?.findAllCategories ?? []

  const [update, { loading: isLoadingUpdate }] = useChangeStreamInfoMutation({
    onCompleted: () => toast.success(t('successMessage')),
    onError: () => toast.error(t('errorMessage'))
  })

  const form = useForm<TypeChangeStreamInfoSchema>({
    resolver: zodResolver(changeStreamInfoSchema),
    values: {
      title: stream?.title ?? '',
      categoryId: stream?.category?.id ?? ''
    }
  })

  const { isValid, isDirty } = form.formState

  function onSubmit(data: TypeChangeStreamInfoSchema) {
    update({ variables: { data } })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">{t('titleLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('titlePlaceholder')} disabled={isLoadingUpdate} className="bg-background" {...field} />
              </FormControl>
              <FormDescription className="text-xs">{t('titleDescription')}</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">{t('categoryLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingUpdate}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('categoryPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">{t('categoryDescription')}</FormDescription>
            </FormItem>
          )}
        />
        <div className='flex justify-end pt-2'>
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!isValid || !isDirty || isLoadingUpdate}>
            {isLoadingUpdate ? (t('loading') || "...") : t('submitButton')}
          </Button>
        </div>
      </form>
    </Form>
  )
}