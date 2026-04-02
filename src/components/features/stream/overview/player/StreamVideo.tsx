'use client'

import { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useConnectionState, useRemoteParticipant, useTracks } from "@livekit/components-react"
import { ConnectionState, Track } from "livekit-client"
import { JSX, useMemo } from "react"
import { OfflineStream } from "./OfflineStream"
import { LoadingStream } from "./LoadingStream"
import { StreamPlayer } from "./StreamPlayer"
import { Skeleton } from "@/src/components/ui/common/Skeleton"

interface StreamVideoProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function StreamVideo({ channel }: StreamVideoProps) {
    const connectionState = useConnectionState()
    const participant = useRemoteParticipant(channel.id)

    // 🔥 ЛОГ ДЛЯ ОТЛАДКИ
    console.log('🔴 StreamVideo DEBUG:', {
        'channel.id': channel.id,
        'participant': participant,
        'participant?.identity': participant?.identity,
        'connectionState': connectionState,
        'isConnected': connectionState === ConnectionState.Connected
    })

    const allTracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone
    ])

    console.log('🔴 StreamVideo allTracks:', allTracks.map(t => ({
        identity: t.participant.identity,
        source: t.source,
        kind: t.publication.track?.kind
    })))

    const tracks = useMemo(() => {
        const filtered = allTracks.filter(
            track => track.participant.identity === channel.id
        )
        console.log('🔴 StreamVideo filtered tracks:', filtered.length)
        return filtered
    }, [allTracks, channel.id])

    let content: JSX.Element

    if (!participant && connectionState === ConnectionState.Connected) {
        content = <OfflineStream channel={channel} />
    }
    else if (!participant || tracks.length === 0) {
        content = <LoadingStream />
    }
    else {
        content = (
            <StreamPlayer 
                participant={participant}
                tracks={tracks}
            />
        )
    }

    return (
        <div className="group relative mb-6 aspect-video rounded-lg overflow-hidden">
            {content}
        </div>
    )
}

export function StreamVideoSkeleton() {
    return (
        <div className="mb-6 aspect-video">
            <Skeleton className="h-full w-full rounded-lg" />
        </div>
    )
}