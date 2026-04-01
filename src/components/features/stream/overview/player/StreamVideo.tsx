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

    // ✅ Получаем ВСЕ треки один раз
    const allTracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone
    ])

    // ✅ Фильтруем только нужного участника (мемоизация чтобы не триггерить ререндеры)
    const tracks = useMemo(() => {
        return allTracks.filter(
            track => track.participant.identity === channel.id
        )
    }, [allTracks, channel.id])

    let content: JSX.Element

    // ✅ Уже подключены, но стримера нет → оффлайн
    if (!participant && connectionState === ConnectionState.Connected) {
        content = <OfflineStream channel={channel} />
    }
    // ⏳ Ещё грузится или нет треков
    else if (!participant || tracks.length === 0) {
        content = <LoadingStream />
    }
    // ✅ Всё ок — передаём данные вниз
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