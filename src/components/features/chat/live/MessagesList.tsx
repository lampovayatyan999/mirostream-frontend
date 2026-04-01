import { 
    FindChatMessagesByStreamQuery, 
    useChatMessageAddedSubscription, 
    useFindChatMessagesByStreamQuery, 
    useFindSponsorsByChannelQuery, 
    type FindChannelByUsernameQuery 
} from "@/src/graphql/generated/output"
import { useEffect, useState } from "react"
import { MessageItem } from "./MessageItem"

interface MessagesListProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function MessagesList({ channel }: MessagesListProps) {
    // 🔥 ФИКС: запрос сообщений только если есть stream.id
    const { data: messagesData } = useFindChatMessagesByStreamQuery({
        variables: {
            streamId: channel.stream.id
        },
        skip: !channel.stream.id
    })

    // 🔥 ФИКС: запрос спонсоров только если есть channel.id
    const shouldSkipSponsors = !channel?.id

    const { data: sponsorsData } = useFindSponsorsByChannelQuery({
        variables: shouldSkipSponsors ? undefined : {
            channelId: channel.id
        },
        skip: shouldSkipSponsors
    })

    const sponsors = sponsorsData?.findSponsorsByChannel ?? []
    const sponsorsIds = new Set(sponsors.map(sponsor => sponsor.user.id))

    const [messages, setMessages] = useState<FindChatMessagesByStreamQuery['findChatMessagesByStream']>([])

    // 🔥 ФИКС: подписка только если есть stream.id
    const { data: newMessageData } = useChatMessageAddedSubscription({
        variables: {
            streamId: channel.stream.id
        },
        skip: !channel.stream.id
    })

    useEffect(() => {
        if (messagesData && messagesData.findChatMessagesByStream) {
            setMessages(messagesData.findChatMessagesByStream)
        }
    }, [messagesData])

    useEffect(() => {
        if (newMessageData) {
            const newMessage = newMessageData.chatMessageAdded
            setMessages(prev => [newMessage, ...prev])
        }
    }, [newMessageData])

    return (
        <div className="flex h-full flex-1 flex-col-reverse overflow-y-auto">
            {messages.map((message, index) => (
                <MessageItem 
                    key={index} 
                    message={message} 
                    isSponsor={sponsorsIds.has(message.user.id)} 
                />
            ))}
        </div>
    )
}