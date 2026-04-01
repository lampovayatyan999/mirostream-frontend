'use client'

import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { ChannelAvatar } from "@/src/components/ui/elements/ChannelAvatar"
import { ChannelVerified } from "@/src/components/ui/elements/ChannelVerified"
import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import { StreamActions } from "./StreamActions"
import { useParticipants } from "@livekit/components-react"
import { Skeleton } from "@/src/components/ui/common/Skeleton"

interface StreamInfoProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function StreamInfo({ channel }: StreamInfoProps) {
    const t = useTranslations('stream.info')

    const participants = channel?.stream?.isLive ? useParticipants() : []
    const participantCount = participants.length > 0 ? participants.length - 1 : 0

    if (!channel || !channel.id) return null

    return (
        <div className="space-y-5">
            <h1 className="text-xl font-semibold">
                {channel.stream?.title} {channel.stream?.category && ` | ${channel.stream.category.title}`}
            </h1>
            <div className="flex flex-col items-start justify-between lg:flex-row">
                <div className="flex items-center gap-x-3 px-1">
                    <ChannelAvatar channel={channel} isLive={channel.stream?.isLive} size='lg' />
                    <div className="space-y-1">
                        <h2 className="flex items-center gap-x-2 text-lg font-semibold">
                            {channel.displayName}
                            {channel.isVerified && <ChannelVerified />}
                        </h2>
                        {channel.stream?.isLive ? (
                            <div className="flex items-center gap-x-1 text-xs font-semibold text-rose-500">
                                <User className="size-4" />
                                {participantCount} {t('viewers')}
                            </div>
                        ) : (
                            <p className="text-xs font-semibold text-muted-foreground">{t('offline')}</p>
                        )}
                    </div>
                </div>
            </div>
            <StreamActions channel={channel} />
        </div>
    )
}

export function StreamInfoSkeleton() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-7 w-[60%]" />
            <div className="flex flex-col items-start justify-between lg:flex-row">
                <div className="flex items-center gap-x-3 px-1">
                    <Skeleton className="size-14 rounded-full" />
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-x-2">
                            <Skeleton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}