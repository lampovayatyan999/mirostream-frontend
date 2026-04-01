import { Button } from "@/src/components/ui/common/Button"
import { Input } from "@/src/components/ui/common/Input"
import { CardContainer } from "@/src/components/ui/elements/CardContainer"
import { CopyButton } from "@/src/components/ui/elements/CopyButton"
import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

type StreamKeyProps = {
    value: string | null
}

export default function StreamKey({ value }: StreamKeyProps) {
    const t = useTranslations('dashboard.keys.key')

    const [isShow, setIsShow] = useState(false)

    const Icon = isShow ? Eye : EyeOff

    return (
        <CardContainer heading={t('heading')} isRightContentFull rightContent={
                <div className="flex w-full items-center gap-x-4">
                    <Input placeholder={t('heading')} type={isShow ? 'text' : 'password'} value={value ?? ''} disabled />
                    <CopyButton value={value} />
                    <Button variant='ghost' size='lgIcon' onClick={() => setIsShow(!isShow)}>
                        <Icon className="size-5" />
                    </Button>
                </div>
            }
        />
    )
}