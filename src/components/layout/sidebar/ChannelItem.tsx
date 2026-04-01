'use client'

import { FindRecommendedChannelsQuery } from "@/src/graphql/generated/output"
import { useSidebar } from "@/src/hooks/useSidebar"
import { usePathname } from "next/navigation"
import { Hint } from "../../ui/elements/Hint"
import { Button } from "../../ui/common/Button"
import Link from "next/link"
import { cn } from "@/src/utils/tw-merge"
import { ChannelAvatar } from "../../ui/elements/ChannelAvatar"
import { ChannelVerified } from "../../ui/elements/ChannelVerified"
import { LiveBadge } from "../../ui/elements/LiveBadge"
import { Skeleton } from "../../ui/common/Skeleton"

interface ChannelItemProps {
    channel: FindRecommendedChannelsQuery['findRecommendedChannels'][0]
}

// ChannelItem.tsx

export function ChannelItem({ channel }: ChannelItemProps) {
    const pathname = usePathname()
    const { isCollapsed } = useSidebar()
    const isActive = pathname === `/${channel.username}`

    if (isCollapsed) {
        return (
            <Hint label={channel.username} side="right" asChild>
                <Link href={`/${channel.username}`} className="mt-3 flex w-full items-center justify-center">
                    <ChannelAvatar channel={channel} isLive={channel.stream.isLive} />
                </Link>
            </Hint>
        )
    }

    return (
        <Button 
            className={cn('h-11 w-full justify-start px-3', isActive && 'bg-(--accent)')} 
            variant='ghost' 
            asChild
        >
            <Link href={`/${channel.username}`} className="flex w-full items-center gap-x-2">
                <ChannelAvatar size="sm" channel={channel} isLive={channel.stream.isLive} />
                
                <div className="flex flex-1 items-center gap-x-1 min-w-0">
                    <p className="truncate text-sm font-semibold">
                        {channel.username}
                    </p>
                    {channel.isVerified && <ChannelVerified size='sm' />}
                </div>

                {channel.stream.isLive && (
                    <div className="ml-auto">
                        <LiveBadge />
                    </div>
                )}
            </Link>
        </Button>
    )
}

export function ChannelItemSkeleton() {
    return (
        <Skeleton className="mt-3 h-11 w-full rounded-full" />
    )
}
