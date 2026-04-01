'use client'

import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { CardContainer } from "@/src/components/ui/elements/CardContainer"
import { useCurrent } from "@/src/hooks/useCurrent"
import { useTranslations } from "next-intl"
import { EnableTotp } from "./EnableTotp"
import { DisableTotp } from "./DisableTotp"

export function WrapperTotp() {
    const t = useTranslations('dashboard.settings.account.twoFactor')

    const {user, isLoadingProfile} = useCurrent()

    return isLoadingProfile ? (
        <WrapperTotpSkeleton />
    ) : (
        <CardContainer heading={t('heading')} description={t('description')} rightContent={<div className="gap-x-4 flex items-center">
            {!user?.isTotpEnabled ? <EnableTotp /> : <DisableTotp /> }
        </div>} />
    )
}

export function WrapperTotpSkeleton() {
    return (
        <Skeleton className="w-full h-24" />
    )
}