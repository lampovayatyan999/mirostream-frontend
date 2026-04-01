'use client'

import { Card } from "@/src/components/ui/common/Card"
import { ChannelAvatar } from "@/src/components/ui/elements/ChannelAvatar"
import { LiveBadge } from "@/src/components/ui/elements/LiveBadge"
import type { FindProfileQuery } from "@/src/graphql/generated/output"
import { getRandomColor } from "@/src/utils/color"
import { getMediaSource } from "@/src/utils/get-media-source"
import Image from "next/image"
import { useEffect, useState } from "react"


interface StreamThumbnailProps{
    url: string | null | undefined
    user: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar' | 'isVerified'>
    isLive?: boolean
}

export function StreamThumbnail({url, user, isLive} : StreamThumbnailProps) {
    const [randomColor, setRandomColor] = useState('')

    useEffect(() => {
        setRandomColor(getRandomColor())
    }, [])

    return <div className="group relative aspect-video cursor-pointer rounded-xl">
        <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition-opacity group-hover:opacity-100" style={{
            backgroundColor: randomColor
        }} />

        {url ? (
            <Image 
                src={getMediaSource(url) ?? '/uploads/images/placeholder.webp'} 
                alt={user.username} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-xl object-cover transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" 
            />
        ) : (
            <Card className="flex flex-col h-full w-full items-center justify-center gap-y-4 rounded-xl transition-transform group-hover:-translate-y-2 group-hover:translate-x-2">
                <ChannelAvatar channel={user} isLive={isLive} />
            </Card>
        )}

        {isLive && (
            <div className="absolute right-2 top-2 transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
                <LiveBadge />
            </div>
        )}
    </div>
}