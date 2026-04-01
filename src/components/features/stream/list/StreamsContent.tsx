'use client'

import { useFindAllStreamsQuery, type FindAllStreamsQuery } from "@/src/graphql/generated/output"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Heading } from "@/src/components/ui/elements/Headings"
import InfiniteScroll from "react-infinite-scroll-component"
import { Divide } from "lucide-react"
import { StreamCardSkeleton } from "./StreamCard"
import { StreamsList } from "./StreamsList"

interface StreamsContentProps {
    streams: FindAllStreamsQuery['findAllStreams']
}


export function StreamsContent({streams}: StreamsContentProps) {
    const t = useTranslations('streams')

    const searchParams = useSearchParams()
    const searchTerm = searchParams.get('searchTerm')

    const [streamList, setStreamList] = useState<FindAllStreamsQuery['findAllStreams']>(streams ?? [])
    const [hasMore, setHasMore] = useState(true)

    const {data, fetchMore} = useFindAllStreamsQuery({
        variables: {
            filters: {
                searchTerm,
                take: 12,
                skip: 0 
            }
        },
        fetchPolicy: 'network-only'
    })

    useEffect(() => {
        if(data?.findAllStreams) {
            setStreamList(data.findAllStreams)
            setHasMore(data.findAllStreams.length === 12)
        }
    }, [data, searchTerm])

    async function fetchMoreStreams() {
        if(!hasMore) return 

        setTimeout(async () => {
            const {data: newData} = await fetchMore({
                variables: {
                    filters: {
                        searchTerm,
                        take: 12,
                        skip: streamList.length
                    }
                }
            })

            if(newData.findAllStreams.length) {
                setStreamList(prev => [...prev, ...newData.findAllStreams])
            } else {
                setHasMore(false)
            }
        }, 300)
    }

    return (
        <>
            <Heading title={searchTerm ? `${t('searchHeading')} "${searchParams}"` : t('heading')} />
                <InfiniteScroll dataLength={streamList.length} next={fetchMoreStreams} hasMore={hasMore} loader={<div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({length:12}).map((_, index) => (
                        <StreamCardSkeleton key={index} />
                    ))}
                </div>
                }
            >
                <StreamsList streams={streamList} />
            </InfiniteScroll>    
        </>
    )
}