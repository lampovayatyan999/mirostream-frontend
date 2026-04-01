import { Input } from "@/src/components/ui/common/Input"
import { CardContainer } from "@/src/components/ui/elements/CardContainer"
import { CopyButton } from "@/src/components/ui/elements/CopyButton"
import { useTranslations } from "next-intl"

type StreamURLProps = {
    value: string | null
}

export default function StreamURL({ value }: StreamURLProps) {
    const t = useTranslations('dashboard.keys.url')

    return (
        <CardContainer heading={t('heading')} isRightContentFull rightContent={
                <div className="flex w-full items-center gap-x-4">
                    <Input placeholder={t('heading')} value={value ?? ''} disabled />
                    <CopyButton value={value} />
                </div>
            }
        />
    )
}