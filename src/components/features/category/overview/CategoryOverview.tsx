'use client'

import { Heading } from "@/src/components/ui/elements/Headings";
import { FindCategoryBySlugQuery } from "@/src/graphql/generated/output";
import { getMediaSource } from "@/src/utils/get-media-source";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { StreamsList } from "../../stream/list/StreamsList";


interface CategoryOverviewProps {
    category: FindCategoryBySlugQuery['findCategoryBySlug']
}

export function CategoryOverview({ category }: CategoryOverviewProps) {
    const t = useTranslations('categories.overview')

    return <div className="space-y-8">
        <div className="gap-x-6 lg:flex lg:space-y-6 lg:items-center">
            <Image src={getMediaSource(category.thumbnailUrl)} alt={category.title} width={192} height={256} className="rounded-xl object-hover" />
            <Heading title={category.title} description={category.description ?? ''} size='xl' />
        </div>
        <StreamsList heading={t('heading')} streams={category.streams} />
    </div>
}