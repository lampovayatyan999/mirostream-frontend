import { CategoriesList } from "@/src/components/features/category/list/CategoriesList";
import { StreamsList } from "@/src/components/features/stream/list/StreamsList"
import { FindRandomCategoriesDocument, type FindRandomCategoriesQuery, FindRandomStreamsDocument, type FindRandomStreamsQuery } from "@/src/graphql/generated/output"
import { SERVER_URL } from "@/src/libs/constants/url.constants"
import { getTranslations } from "next-intl/server"

async function findRandomStreams() {
  try {
    const query = FindRandomStreamsDocument.loc?.source.body

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ query }),
      next: {
        revalidate: 30
      }
    })

    const data = await response.json()

    return {
        streams: (data?.data?.findRandomStreams as FindRandomStreamsQuery['findRandomStreams']) ?? []
      }
  } catch (error) 
    {
      console.error('findRandomStreams error:', error)
      return { streams: [] }
    }
}

async function findRandomCategories() {
  try {
    const query = FindRandomCategoriesDocument.loc?.source.body

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ query }),
      next: {
        revalidate: 30
      }
    })

    const data = await response.json()

    return {
        categories: (data?.data?.findRandomCategories as FindRandomCategoriesQuery['findRandomCategories']) ?? []
      }
  } catch (error) 
    {
      console.error('findRandomCategories error:', error)
      return { categories: [] }
    }
}

export default async function HomePage() {
  const t = await getTranslations('home')
  
  const {streams} = await findRandomStreams()
  const { categories } = await findRandomCategories()

  return <div className="space-y-10">
    <StreamsList heading={t('streamsHeading')} streams={streams} />
    <CategoriesList heading={t('categoriesHeading')} categories={categories} />
  </div>
}