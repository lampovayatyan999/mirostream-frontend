import { StreamOverview } from "@/src/components/features/stream/overview/StreamOverview"
import { FindChannelByUsernameDocument } from "@/src/graphql/generated/output"
import { type FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { SERVER_URL } from "@/src/libs/constants/url.constants"
import { getMediaSource } from "@/src/utils/get-media-source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

async function getChannel(username: string) {
    console.log('🔵 [getChannel] START username:', username)
    try {
        const query = FindChannelByUsernameDocument.loc?.source.body
        console.log('🔵 [getChannel] query length:', query?.length)
        
        const variables = { username }
        console.log('🔵 [getChannel] variables:', variables)
    
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            next: { revalidate: 30 }
        })
        
        console.log('🔵 [getChannel] response status:', response.status)
        
        const data = await response.json()
        console.log('🔵 [getChannel] full response data:', JSON.stringify(data, null, 2))
        
        const channel = data?.data?.findChannelByUsername
        console.log('🔵 [getChannel] extracted channel:', channel)
        
        return channel || null
    } catch (error) {
        console.error('🔴 [getChannel] ERROR:', error)
        return null
    }
}

export async function generateMetadata(props: {
    params: Promise<{ username: string }>
}): Promise<Metadata> {
    const params = await props.params
    const channel = await getChannel(params.username)

    if (!channel) {
        return { title: 'Channel not found' }
    }

    return {
        title: channel.displayName,
        description: channel.bio ?? channel.displayName,
        openGraph: {
            images: [{
                url: getMediaSource(channel.avatar),
                alt: channel.displayName
            }]
        }
    }
}

export default async function ChannelPage(props: {
    params: Promise<{ username: string }>
}) {
    const params = await props.params
    console.log('🔵 [ChannelPage] params:', params)
    const channel = await getChannel(params.username)

    console.log('🔵 [ChannelPage] final channel:', channel)

    if (!channel) {
        console.log('🔵 [ChannelPage] calling notFound()')
        notFound()
    }

    console.log('🔵 [ChannelPage] rendering StreamOverview')
    return <StreamOverview channel={channel} />
}