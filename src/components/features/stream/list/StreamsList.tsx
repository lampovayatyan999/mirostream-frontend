import { Heading } from "@/src/components/ui/elements/Headings"
import type { FindRandomStreamsQuery } from "@/src/graphql/generated/output"
import { StreamCard } from "./StreamCard"
import { EmptyState } from "@/src/components/ui/elements/EmptyState"

interface StreamsListProps {
    heading?: string
    streams: FindRandomStreamsQuery['findRandomStreams']
}


export function StreamsList({heading, streams}: StreamsListProps) {
    console.log("StreamsList props:", streams);
    return streams.length > 0 ? (
    <>
        {heading && <Heading title={heading} />}
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {streams.map((stream, index) => <StreamCard key={index} stream={stream} />)}
        </div>
    </>
    ) : (
        <EmptyState />
    );
}