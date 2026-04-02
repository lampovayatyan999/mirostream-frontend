'use client'

import { useEffect, useState } from 'react'
import { useConnectionState } from "@livekit/components-react"
import { ConnectionState } from "livekit-client"
import { LiveKitRoom } from "@livekit/components-react"
import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useStreamToken } from "@/src/hooks/useStreamToken"
import { OfflineStream } from './player/OfflineStream'
import { StreamSettings } from '../settings/StreamSettings'
import { AboutChannel, AboutChannelSkeleton } from './info/AbountChannel'
import { ChannelSponsors } from './info/ChannelSponsors'
import { LiveChat, LiveChatSkeleton } from '../../chat/live/LiveChat'
import { StreamVideo, StreamVideoSkeleton } from './player/StreamVideo'

function RoomConnectionStatus({ onConnected }: { onConnected: (connected: boolean) => void }) {
  const connectionState = useConnectionState()
  const isConnected = connectionState === ConnectionState.Connected
  useEffect(() => {
    onConnected(isConnected)
  }, [isConnected, onConnected])
  return null
}

interface StreamOverviewProps {
  channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function StreamOverview({ channel }: StreamOverviewProps) {
  const { token, isLoading } = useStreamToken(channel?.id)
  const isLive = Boolean(channel?.stream?.isLive && token)
  const [isRoomConnected, setIsRoomConnected] = useState(false)

  if (!channel || isLoading) {
    return <StreamOverviewSkeleton />
  }

  if (!isLive) {
    return (
      <div className="mx-auto grid max-w-screen-2xl w-full grid-cols-1 gap-6 px-4 lg:px-0 lg:grid-cols-7">
        <div className="order-1 col-span-1 flex flex-col lg:col-span-5">
          <div className="aspect-video w-full">
            <OfflineStream channel={channel} />
          </div>
          <StreamSettings channel={channel} />
          <AboutChannel channel={channel} />
          <ChannelSponsors channel={channel} />
        </div>
        <div className="order-2 col-span-1 flex flex-col space-y-6 lg:col-span-2 min-h-[400px] h-auto">
          <LiveChat
            channel={channel}
            isChatEnabled={channel.stream?.isChatEnabled ?? false}
            isChatFollowersOnly={channel.stream?.isChatFollowersOnly ?? false}
            isChatPremiumFollowersOnly={channel.stream?.isChatPremiumFollowersOnly ?? false}
            isRoomConnected={false}
          />
        </div>
      </div>
    )
  }

  return (
    <LiveKitRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}>
      <RoomConnectionStatus onConnected={setIsRoomConnected} />
      <div className="mx-auto grid max-w-screen-2xl w-full grid-cols-1 gap-6 px-4 lg:px-0 lg:grid-cols-7">
        <div className="order-1 col-span-1 flex flex-col lg:col-span-5">
          <StreamVideo channel={channel} />
          <StreamSettings channel={channel} />
          <AboutChannel channel={channel} />
          <ChannelSponsors channel={channel} />
        </div>
        <div className="order-2 col-span-1 flex flex-col space-y-6 lg:col-span-2 min-h-[400px] h-[calc(100vh-200px)] lg:h-auto">
          <LiveChat
            channel={channel}
            isChatEnabled={channel.stream?.isChatEnabled ?? false}
            isChatFollowersOnly={channel.stream?.isChatFollowersOnly ?? false}
            isChatPremiumFollowersOnly={channel.stream?.isChatPremiumFollowersOnly ?? false}
            isRoomConnected={isRoomConnected}
          />
        </div>
      </div>
    </LiveKitRoom>
  )
}

export function StreamOverviewSkeleton() {
  return (
    <div className="mx-auto grid max-w-screen-2xl w-full grid-cols-1 gap-6 px-4 lg:px-0 lg:grid-cols-7">
      <div className="order-1 col-span-1 flex flex-col lg:col-span-5">
        <StreamVideoSkeleton />
        <div className="mt-4 h-20 w-full animate-pulse rounded bg-gray-200" />
        <AboutChannelSkeleton />
      </div>
      <div className="order-2 col-span-1 flex flex-col space-y-6 lg:col-span-2">
        <LiveChatSkeleton />
      </div>
    </div>
  )
}