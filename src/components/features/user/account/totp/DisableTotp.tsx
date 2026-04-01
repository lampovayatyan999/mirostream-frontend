import { Button } from "@/src/components/ui/common/Button"
import { ConfirmModal } from "@/src/components/ui/elements/ConfirmModal"
import { useDisableTotpMutation } from "@/src/graphql/generated/output"
import { useCurrent } from "@/src/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export function DisableTotp() {
    const t = useTranslations('dashboard.settings.account.twoFactor.disable')

    const { refetch } = useCurrent()

    
    const [disable, {loading: isLoadingDisable}] = useDisableTotpMutation({
        onCompleted() {
            refetch()
            toast.success(t('successMessage'))
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    })

    return (
        <ConfirmModal heading={t('heading')} message={t('message')} onConfirm={() => disable()}>
            <Button variant='secondary' disabled={isLoadingDisable}>
                {t('trigger')}
            </Button>
        </ConfirmModal>
    )
}