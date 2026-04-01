'use client'

import { Button } from "@/src/components/ui/common/Button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/src/components/ui/common/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/common/Tabs"
import { useFindSponsorsByChannelQuery, useMakePaymentsMutation, type FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useAuth } from "@/src/hooks/useAuth"
import { useCurrent } from "@/src/hooks/useCurrent"
import { convertPrice } from "@/src/utils/convert-price"
import { Medal } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SupportButtonProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function SupportButton({ channel }: SupportButtonProps) {
    const t = useTranslations('stream.actions.support')
    const router = useRouter()

    const { isAuthenticated } = useAuth()
    const { user, isLoadingProfile } = useCurrent()

    // 🔥 ФИКС: не вызываем запрос если нет channel.id
    const shouldSkipSponsorsQuery = !channel?.id || !isAuthenticated || !user

    const { data } = useFindSponsorsByChannelQuery({
        variables: shouldSkipSponsorsQuery ? undefined : {
            channelId: channel.id
        },
        skip: shouldSkipSponsorsQuery
    })

    const sponsors = data?.findSponsorsByChannel

    const [makePayments, { loading: isLoadingMakePayments }] = useMakePaymentsMutation({
        onCompleted(data) {
            router.push(data.makePayments.url)
        },
        onError() {
            toast.error(t('errorMesssage'))
        }
    })

    const isSponsor = sponsors?.some(sponsor => sponsor.user.id === user?.id)
    const isOwnerChannel = user?.id === channel.id

    // Владелец канала или загрузка профиля — не показываем кнопку
    if (isOwnerChannel || isLoadingProfile) {
        return null
    }

    // Уже спонсор — показываем disabled кнопку
    if (isSponsor) {
        return (
            <Button variant='secondary' disabled>
                <Medal className="size-4" />
                {t('alreadySponsor')}
            </Button>
        )
    }

    // Проверка наличия планов спонсорства
    const plans = channel.sponsorshipPlans
    if (!plans || plans.length === 0) {
        return null
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>
                    <Medal className="size-4" />
                    {t('supportAuthor')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Tabs defaultValue={plans[0].id}>
                    <TabsList className="mb-4 w-full">
                        {plans.map((plan) => (
                            <TabsTrigger key={plan.id} value={plan.id} className="flex-1">
                                {plan.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {plans.map((plan) => (
                        <TabsContent key={plan.id} value={plan.id}>
                            <DialogTitle className="text-2xl">
                                {convertPrice(plan.price)}
                            </DialogTitle>
                            {plan.description && (
                                <DialogDescription className="mt-2 text-sm">
                                    {plan.description}
                                </DialogDescription>
                            )}
                            <Button 
                                onClick={() => makePayments({
                                    variables: {
                                        planId: plan.id
                                    }
                                })} 
                                className="mt-3 w-full"
                                disabled={isLoadingMakePayments}
                            >
                                {t('choose')}
                            </Button>
                        </TabsContent>
                    ))}
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}