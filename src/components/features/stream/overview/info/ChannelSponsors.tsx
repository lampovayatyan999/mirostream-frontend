import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/common/Card"
import { ChannelAvatar } from "@/src/components/ui/elements/ChannelAvatar"
import { useFindSponsorsByChannelQuery, type FindChannelByUsernameQuery } from "@/src/graphql/generated/output"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface ChannelSponsorsProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function ChannelSponsors({ channel }: ChannelSponsorsProps) {
    const t = useTranslations('stream.sponsors')

    // 🔥 ФИКС: не вызываем запрос если нет channel.id
    const shouldSkip = !channel?.id

    const { data, loading: isLoadingSponsors } = useFindSponsorsByChannelQuery({
        variables: shouldSkip ? undefined : {
            channelId: channel.id
        },
        skip: shouldSkip
    })

    const sponsors = data?.findSponsorsByChannel ?? []

    // Если нет спонсоров или загрузка — не показываем
    if (!sponsors.length || isLoadingSponsors) return null

    return (
        <Card className="mt-6">
            <CardHeader className="p-4">
                <CardTitle className="text-xl">
                    {t('heading')} {channel.displayName}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-12 px-4">
                {sponsors.map((sponsor) => (
                    <Link key={sponsor.user.id} href={`/${sponsor.user.username}`}>
                        <ChannelAvatar channel={sponsor.user} size="lg" />
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}