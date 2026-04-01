'use client'

import { CardContainer } from "@/src/components/ui/elements/CardContainer"
import { useConfig } from "@/src/hooks/useConfig"
import { BASE_COLORS } from "@/src/libs/constants/colors.constants"
import { cn } from "@/src/utils/tw-merge"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import type { CSSProperties } from "react"

export function ChangeColorForm() {
    const t = useTranslations('dashboard.settings.appearance.color')
    const config = useConfig() 

    return (
        <CardContainer 
            heading={t('heading')} 
            description={t('description')} 
            rightContent={
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {BASE_COLORS.map((theme) => {
                        const isActive = config.theme === theme.name
                        
                        const hslValue = `hsl(${theme.color.replace(/,/g, '')})`

                        return (
                            <button 
                                key={theme.name}
                                onClick={() => config.setTheme(theme.name)}
                                className="group relative flex size-9 items-center justify-center cursor-pointer"
                            >
                                <span 
                                    className={cn(
                                        "flex size-9 shrink-0 items-center justify-center rounded-lg transition-all",
                                        "hover:ring-2 hover:ring-foreground hover:ring-offset-2",
                                        isActive ? "ring-2 ring-foreground ring-offset-2" : ""
                                    )}
                                    style={{ backgroundColor: hslValue }}
                                >
                                    {isActive && <Check className="size-5 text-white" />}
                                </span>
                            </button>
                        )
                    })}
                </div>
            } 
        />
    )
}