import { Button } from "@/src/components/ui/common/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/common/Dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/src/components/ui/common/Form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/src/components/ui/common/InputOTP"
import { useEnableTotpMutation, useGenerateTotpSecretQuery } from "@/src/graphql/generated/output"
import { useCurrent } from "@/src/hooks/useCurrent"
import { enableTotpSchema, type TypeEnableTotpSchema } from "@/src/schemas/user/enable-totp.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EnableTotp () {
    const t = useTranslations('dashboard.settings.account.twoFactor.enable')

    const [isOpen, setIsOpen] = useState(false)
    const { refetch } = useCurrent()

    const {data, loading:isLoadingGenerate} = useGenerateTotpSecretQuery()
    const twoFactorAuth = data?.generateTotpSecret

    const form = useForm<TypeEnableTotpSchema>({
        resolver: zodResolver(enableTotpSchema),
        defaultValues: {
            pin: ''
        }
    })

    const [enable, {loading: isLoadingEnable}] = useEnableTotpMutation({
        onCompleted() {
            refetch()
            setIsOpen(false)
            toast.success(t('successMessage'))
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    })

    const {isValid} = form.formState

    function onSubmit(data: TypeEnableTotpSchema) {
        enable({variables: {data: {
            secret: twoFactorAuth?.secret ?? '',
            pin: data.pin
        }}})
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>{t('trigger')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('heading')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <span className="text-sm text-(--muted-foreground)">
                                {twoFactorAuth?.qrcodeUrl ? t('qrInstructions') : ''}
                            </span>
                            <img src={twoFactorAuth?.qrcodeUrl} alt="QR" className="rounded-lg"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-center text-sm text-(--muted-foreground)">
                                {twoFactorAuth?.secret ? t('secretCodeLabel') + twoFactorAuth.secret : ''}
                            </span>
                        </div>
                        <FormField control={form.control} name="pin" render={({field}) => (
                            <FormItem className="flex flex-col justify-center mex-sm:items-center">
                                <FormLabel>{t('pinLabel')}</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field} containerClassName="justify-center">
                                        <div className="flex items-center gap-3"> 
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        
                                        <InputOTPSeparator />
                                        
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                        </div>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>{t('pinDescription')}</FormDescription>
                            </FormItem>
                        )} 
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={!isValid || isLoadingGenerate || isLoadingEnable}>
                            {t('submitButton')}
                        </Button>
                    </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
