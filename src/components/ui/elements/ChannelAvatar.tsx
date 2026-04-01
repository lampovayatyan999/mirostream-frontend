'use client'

import { useMemo } from "react"
import { FindProfileQuery } from "@/src/graphql/generated/output"
import { cva, type VariantProps } from "class-variance-authority"
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avart"
import { cn } from "@/src/utils/tw-merge"
import { getMediaSource } from "@/src/utils/get-media-source"

const avatarSizes = cva('', {
    variants: {
        size: {
            sm: 'size-7',
            default: 'size-9',
            lg: 'size-14',
            xl: 'size-32'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
    channel: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar'>
    isLive?: boolean
}

export function ChannelAvatar({ size, channel, isLive }: ChannelAvatarProps) {
    const rawPath = channel.avatar

    const avatarSrc = useMemo(() => {
        if (!rawPath) return undefined
        
        if (rawPath.startsWith('blob:') || rawPath.startsWith('data:')) {
            return rawPath
        }

        const source = getMediaSource(rawPath)
        const separator = source.includes('?') ? '&' : '?'
        
        return source.includes('v=') ? source : `${source}${separator}v=${Date.now()}`
    }, [rawPath])

    return (
        <div className="relative">
            <Avatar className={cn(avatarSizes({ size }), isLive && 'ring-2 ring-rose-500')}>
                {avatarSrc && (
                    <AvatarImage 
                        src={avatarSrc} 
                        key={avatarSrc} 
                        className="object-cover" 
                        onLoadingStatusChange={(status) => console.log('Avatar Status:', status, avatarSrc)}
                    />
                )}
                <AvatarFallback className={cn(size === 'xl' && 'text-xl')}>
                    {channel.username?.[0]?.toUpperCase() ?? '?'}
                </AvatarFallback>
            </Avatar>
        </div>
    )
}