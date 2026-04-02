'use client'

import { Card } from "@/src/components/ui/common/Card"
import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { MessageSquareOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { LiveChatInner } from "./LiveChatInner"
import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"

interface LiveChatProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
    isChatEnabled: boolean
    isChatFollowersOnly: boolean
    isChatPremiumFollowersOnly: boolean
    isRoomConnected: boolean
}

export function LiveChat(props: LiveChatProps) {
    const t = useTranslations('chat')
    const isLive = props.channel.stream?.isLive

    if (!isLive) {
        return (
            <Card className="flex h-[82%] w-full flex-col items-center justify-center lg:fixed lg:w-[21.5%]">
                <MessageSquareOff className="size-10 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">{t('unavailable')}</p>
            </Card>
        )
    }

    if (!props.isRoomConnected) {
        return (
            <Card className="flex h-[82%] w-full flex-col items-center justify-center lg:fixed lg:w-[21.5%]">
                <div className="text-muted-foreground">Подключение к чату...</div>
            </Card>
        )
    }

    return <LiveChatInner {...props} />
}

export function LiveChatSkeleton() {
    return (
        <Skeleton className="flex h-[82%] w-full flex-col lg:fixed lg:w-[21.5%]" />
    )
}