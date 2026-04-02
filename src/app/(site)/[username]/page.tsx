import { StreamOverview } from "@/src/components/features/stream/overview/StreamOverview"
import { SERVER_URL } from "@/src/libs/constants/url.constants"
import { getMediaSource } from "@/src/utils/get-media-source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const GET_CHANNEL_QUERY = `
  query FindChannelByUsername($username: String!) {
    findChannelByUsername(username: $username) {
      id
      displayName
      username
      avatar
      isVerified
      bio
      socialLinks {
        id
        title
        url
      }
      stream {
        id
        thumbnailUrl
        isLive
        title
        serverUrl
        streamKey
        isChatEnabled
        isChatFollowersOnly
        isChatPremiumFollowersOnly
      }
      sponsorshipPlans {
        id
        title
        description
        price
      }
      followings {
        id
      }
    }
  }
`

async function getChannel(username: string) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: GET_CHANNEL_QUERY,
                variables: { username }
            }),
            next: { revalidate: 30 }
        })

        const data = await response.json()
        const channel = data?.data?.findChannelByUsername
        return channel || null
    } catch (error) {
        console.error('Error fetching channel:', error)
        return null
    }
}

export async function generateMetadata(props: { params: Promise<{ username: string }> }) {
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

export default async function ChannelPage(props: { params: Promise<{ username: string }> }) {
    const params = await props.params
    const channel = await getChannel(params.username)

    if (!channel) {
        notFound()
    }

    return <StreamOverview channel={channel.stream} />
}