import { FollowersTable } from "@/src/components/features/follow/table/FollowersTable";
import { SponsorsTable } from "@/src/components/features/sponsorship/subsription/table/SponsorsTable";
import { NO_INDEX_PAGE } from "@/src/libs/constants/seo.constants";
import { Metadata } from "next"
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.sponsors.header');
    
    return {
        title: t("heading"),
        description: t('description'),
        ...NO_INDEX_PAGE
    };
}

export default function SponsorsPage() {
    return <SponsorsTable />
}