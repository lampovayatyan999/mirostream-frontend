'use client'

import { useSidebar } from "@/src/hooks/useSidebar"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Hint } from "../../ui/elements/Hint"
import { Button } from "../../ui/common/Button"
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react"

export function SidebarHeader() {
    const t = useTranslations('layout.sidebar.header')
    const { isCollapsed, open, close } = useSidebar()
    
    const label = isCollapsed ? t('expand') : t('collapse')

    return (
        <div className="flex w-full items-center justify-center p-3">
            {isCollapsed ? (
                <Hint label={label} side="right" asChild>
                    <Button onClick={() => open()} variant='ghost' size='icon'>
                        <ArrowRightFromLine className="size-4" />
                    </Button>
                </Hint>
            ) : (
                <div className="flex w-full items-center justify-between pl-1">
                    <h2 className="text-lg font-semibold text-(--foreground)">
                        {t('navigation')}
                    </h2>
                    <Hint label={label} side="right" asChild>
                        <Button onClick={() => close() } variant='ghost' size='icon'>
                            <ArrowLeftFromLine className="size-4" />
                        </Button>
                    </Hint>
                </div>
            )}
        </div>
    )
}
