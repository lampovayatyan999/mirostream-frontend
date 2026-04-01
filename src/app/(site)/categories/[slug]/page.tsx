import { CategoryOverview } from "@/src/components/features/category/overview/CategoryOverview"
import { FindCategoryBySlugDocument, type FindCategoryBySlugQuery } from "@/src/graphql/generated/output"
import { SERVER_URL } from "@/src/libs/constants/url.constants"
import { getMediaSource } from "@/src/utils/get-media-source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

async function findCategoryBySlug(params: {slug: string }) {
    try {
        const query = FindCategoryBySlugDocument.loc?.source.body

        const variables = {slug:params.slug}
    
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
                category: (data?.data?.findCategoryBySlug as FindCategoryBySlugQuery['findCategoryBySlug']) ?? []
              } 
    } catch (error) {
        return notFound()
    }
}

export async function generateMetadata(props: {
    params: Promise<{slug: string}>
}):Promise<Metadata> {
    const params = await props.params

    const { category } = await findCategoryBySlug(params)

    return {
        title: category.title,
        description: category.description,
        openGraph: {
            images: [
                {
                    url: getMediaSource(category.thumbnailUrl),
                    alt: category.title
                }
            ]
        }
    }
}

export default async function CategoryPage(props: {
    params: Promise<{slug: string}>
}) {
    const params = await props.params

    const { category } = await findCategoryBySlug(params)

    return <CategoryOverview category={category} />
}