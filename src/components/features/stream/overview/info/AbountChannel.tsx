'use client'

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/src/components/ui/common/Card"
import { Skeleton } from "@/src/components/ui/common/Skeleton"
import { FollowButton } from "./FollowButton"
import { SupportButton } from "./SupportButton"
import { ShareActions } from "./ShareActions"

interface AboutChannelProps {
    channel: any
}

export function AboutChannel({ channel }: AboutChannelProps) {
    const t = useTranslations('aboutChannel')
    
    if (!channel) {
        return <AboutChannelSkeleton />
    }

    // Используем followers вместо followersCount
    const followersCount = channel.followers?.length ?? 0
    const bio = channel.bio

    return (
        <Card className="mt-6">
            <CardContent className="space-y-2 px-4 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                        {t('heading')} {channel.displayName}
                    </h2>
                    <div className="flex items-center gap-2">
                        <FollowButton channel={channel} />
                        <SupportButton channel={channel} />
                        <ShareActions channel={channel} />
                    </div>
                </div>
                
                <div className="text-[15px] text-foreground">
                    <span className="font-semibold">{followersCount}</span> {t('followersCount')}
                </div>
                
                <div className="text-[15px] text-muted-foreground">
                    {bio || t('noDescription')}
                </div>
            </CardContent>
        </Card>
    )
}

export function AboutChannelSkeleton() {
    return (
        <Card className="mt-6">
            <CardContent className="space-y-2 px-4 py-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-9" />
                    </div>
                </div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-16 w-full" />
            </CardContent>
        </Card>
    )
}