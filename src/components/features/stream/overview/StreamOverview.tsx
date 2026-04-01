'use client'

import type { FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useStreamToken } from "@/src/hooks/useStreamToken"
import { LiveKitRoom } from "@livekit/components-react"
import { StreamVideo, StreamVideoSkeleton } from "./player/StreamVideo"
import { StreamInfo, StreamInfoSkeleton } from "./info/StreamInfo"
import { OfflineStream } from "./player/OfflineStream"
import { AboutChannel, AboutChannelSkeleton } from "./info/AbountChannel"
import { ChannelSponsors } from "./info/ChannelSponsors"
import { LiveChat, LiveChatSkeleton } from "../../chat/live/LiveChat"

interface StreamOverviewProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function StreamOverview({ channel }: StreamOverviewProps) {
    console.log('StreamOverview channel:', channel)
    console.log('channel.id:', channel?.id)
    
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // JWT от LiveKit    console.log('LiveKit token:', token)
    const isLive = !!token

   if (!channel || !token) {
        return <StreamOverviewSkeleton />
    }

    return (
        <div className="mx-auto grid max-w-screen-2xl w-full grid-cols-1 gap-6 lg:grid-cols-7">
            <div className="order-1 col-span-1 flex flex-col lg:col-span-5">
                {isLive && token ? (
                    <LiveKitRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}>
                        <StreamVideo channel={channel} />
                        <StreamInfo channel={channel} />
                        <AboutChannel channel={channel}/>
                        <ChannelSponsors channel={channel} />
                    </LiveKitRoom>
                ) : (
                    <div className="aspect-video w-full">
                        <OfflineStream channel={channel} />
                    </div>
                )}
            </div>
            <div className="order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2">
                <LiveChat
                    channel={channel}
                    isChatEnabled={channel.stream?.isChatEnabled ?? false}
                    isChatFollowersOnly={channel.stream?.isChatFollowersOnly ?? false}
                    isChatPremiumFollowersOnly={channel.stream?.isChatPremiumFollowersOnly ?? false}
                />
            </div>
        </div>
    )
}

export function StreamOverviewSkeleton() {
    return (
        <div className="mx-auto grid  grid-cols-1 gap-6 lg:grid-cols-7">
            <div className="order-1 col-span-1 flex flex-col lg:col-span-5">
                <StreamVideoSkeleton />
                <StreamInfoSkeleton />
                <AboutChannelSkeleton />
            </div>
            <div className="order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2">
                <LiveChatSkeleton />
            </div>
        </div>
    )
}