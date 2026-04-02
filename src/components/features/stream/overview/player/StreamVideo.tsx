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

  const allTracks = useTracks([Track.Source.Camera, Track.Source.Microphone])
  const tracks = useMemo(() => {
    return allTracks.filter(track => track.participant.identity === channel.id)
  }, [allTracks, channel.id])

  let content: JSX.Element

  // ✅ ИСПРАВЛЕННАЯ ЛОГИКА: сначала проверяем подключение, потом наличие участника
  if (connectionState === ConnectionState.Connecting) {
    content = <LoadingStream />
  } else if (!participant || tracks.length === 0) {
    content = <OfflineStream channel={channel} />
  } else {
    content = <StreamPlayer participant={participant} tracks={tracks} />
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