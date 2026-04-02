'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/common/Card"
import { useFindMyFollowingsQuery, useFindSponsorsByChannelQuery, type FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useAuth } from "@/src/hooks/useAuth"
import { useCurrent } from "@/src/hooks/useCurrent"
import { useConnectionState, useRemoteParticipant } from "@livekit/components-react"
import { ConnectionState } from "livekit-client"
import { MessageSquareOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { LoadingChat } from "./LoadingChat"
import { SendMessageForm } from "./SendMessageForm"
import { MessagesList } from "./MessagesList"
import { ChatInfo } from "./ChatInfo"

interface LiveChatProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
    isChatEnabled: boolean
    isChatFollowersOnly: boolean
    isChatPremiumFollowersOnly: boolean
}

export function LiveChatInner({ 
    channel, 
    isChatEnabled, 
    isChatFollowersOnly, 
    isChatPremiumFollowersOnly 
}: LiveChatProps) {
    const t = useTranslations('stream.chat')
    const { isAuthenticated } = useAuth()
    const { user, isLoadingProfile } = useCurrent()

    // Данные
    const { data: followingsData, loading: isLoadingFollowings } = useFindMyFollowingsQuery({
        skip: !isAuthenticated
    })
    const followings = followingsData?.findMyFollowings ?? []

    const shouldSkipSponsors = !channel?.id
    const { data: sponsorsData, loading: isLoadingSponsors } = useFindSponsorsByChannelQuery({
        variables: shouldSkipSponsors ? undefined : { channelId: channel.id },
        skip: shouldSkipSponsors
    })
    const sponsors = sponsorsData?.findSponsorsByChannel ?? []

    const isOwnerChannel = user?.id === channel.id
    const isFollower = followings.some(f => f.following.id === channel.id)
    const isSponsor = user ? sponsors.some(s => s.user.id === user.id) : false

    // LiveKit хуки (теперь безопасны, так как вызваны только когда есть контекст)
    const connectionState = useConnectionState()
    const participant = useRemoteParticipant(channel.id)
    const isOnline = !!participant && connectionState === ConnectionState.Connected

    const isDisabled =
        !isOnline ||
        !isAuthenticated ||
        !isChatEnabled ||
        (isChatFollowersOnly && !isFollower && !isOwnerChannel) ||
        (isChatPremiumFollowersOnly && !isSponsor && !isOwnerChannel)

    if (connectionState === ConnectionState.Connecting || isLoadingProfile || isLoadingFollowings || isLoadingSponsors) {
        return <LoadingChat />
    }

    return (
        <Card className="flex h-[82%] w-full flex-col overflow-y-auto lg:fixed lg:w-[21.5%] xl:mt-0">
            <CardHeader className="border-b py-2">
                <CardTitle className="text-center text-lg">
                    {t('heading')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-col overflow-y-auto p-4">
                {isChatEnabled ? (
                    <>
                        <MessagesList channel={channel} />
                        <ChatInfo
                            isOwnerChannel={isOwnerChannel}
                            isFollower={isFollower}
                            isSponsor={isSponsor}
                            isChatEnabled={isChatEnabled}
                            isChatFollowersOnly={isChatFollowersOnly}
                            isChatPremiumFollowersOnly={isChatPremiumFollowersOnly}
                        />
                        <SendMessageForm channel={channel} isDisabled={isDisabled} />
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                        <MessageSquareOff className="size-10 text-muted-foreground" />
                        <h2 className="mt-3 text-xl font-medium">{t('unavaible')}</h2>
                        <p className="mt-1 w-full text-center text-muted-foreground">{t('unavaibleMessage')}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}