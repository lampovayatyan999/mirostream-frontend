import { ChangeChatSettings } from "@/src/components/features/chat/settings/ChangeChatSettings";
import { NO_INDEX_PAGE } from "@/src/libs/constants/seo.constants";
import { Metadata } from "next"
import { getTranslations } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.chat.header');
    
    return {
        title: t("heading"),
        description: t('description'),
        ...NO_INDEX_PAGE
    };
}

export default function ChatSettingsPage() {
    return <ChangeChatSettings />
}