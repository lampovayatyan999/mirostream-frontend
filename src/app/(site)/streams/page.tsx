import { CategoryOverview } from "@/src/components/features/category/overview/CategoryOverview"
import { StreamsContent } from "@/src/components/features/stream/list/StreamsContent"
import { FindAllStreamsDocument, type FindAllStreamsQuery } from "@/src/graphql/generated/output"
import { SERVER_URL } from "@/src/libs/constants/url.constants"
import { getMediaSource } from "@/src/utils/get-media-source"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

async function findAllStreams() {
    try {
        const query = FindAllStreamsDocument.loc?.source.body

        const variables = {
            filters: {}
        }
    
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ query, variables}),
            next: {
            revalidate: 30
            }
        })
        
            const data = await response.json()
        
            return {
                streams: (data?.data?.findAllStreams as FindAllStreamsQuery['findAllStreams']) ?? []
              } 
    } catch (error) {
        console.log(error)
        return {
            streams: []
        }
    }
}

export async function generateMetadata(props: {
    searchParams: Promise<{searchTerm: string}>
}):Promise<Metadata> {
    const t = await getTranslations('streams')

    const searchParams = await props.searchParams

    return {
        title: searchParams.searchTerm ? `${t('searchHeading')} "${searchParams.searchTerm}"` : t('heading')
    }
}

export default async function StreamsPage() {
    const { streams } = await findAllStreams()

    return <StreamsContent streams={streams} />
}