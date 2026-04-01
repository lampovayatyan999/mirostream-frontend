'use client'

import { Card } from "@/src/components/ui/common/Card"
import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { getMediaSource } from "@/src/utils/get-media-source"
import { WifiOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { CSSProperties } from "react"

interface OfflineStreamProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function OfflineStream({channel}: OfflineStreamProps) {
    const t = useTranslations('stream.video')

    const backgroundStyle:CSSProperties = channel.stream?.thumbnailUrl ? {
        backgroundImage: `url(${getMediaSource(channel.stream.thumbnailUrl)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    } : {}

    return <Card className="flex h-full flex-col items-center justify-center" style={backgroundStyle}>
        {channel.stream?.thumbnailUrl && (
            <div className="absolute inset-0 z-0 rounded-lg bg-black opacity-60" />
        )}
        <WifiOff className="z-10 mt-3 size-12 text-muted-foreground" />
        <p className="z-10 text-lg text-white">{channel.displayName} {t('offline')}</p>        
    </Card>
}