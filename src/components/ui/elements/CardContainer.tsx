import type { PropsWithChildren, ReactNode } from "react"
import { Card } from "../common/Card"
import type { LucideIcon } from "lucide-react"
import type {IconType} from 'react-icons'
import { cn } from "@/src/utils/tw-merge"

interface CardContainerProps {
    heading: string
    description?: string
    Icon?: IconType | LucideIcon
    isRightContentFull?: boolean
    rightContent?: ReactNode
}

export function CardContainer({ heading, description, Icon, isRightContentFull, rightContent, children }: PropsWithChildren<CardContainerProps>) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-x-6"> 
                <div className="flex flex-row items-center gap-x-4 shrink-0"> 
                    {Icon && (
                        <div className="rounded-full bg-foreground p-2.5">
                            <Icon className='size-7 text-secondary' />
                        </div>
                    )}
                    <div className="space-y-1">
                        <h2 className="font-semibold tracking-wide">{heading}</h2>
                        {description && <p className="max-w-4xl text-sm text-muted-foreground">{description}</p>}
                    </div>
                </div>

                {rightContent && (
                    <div className={cn(
                        "flex items-center justify-end",
                        isRightContentFull ? "flex-1 w-full ml-8" : "shrink-0"
                    )}>
                        {rightContent}
                    </div>
                )}
            </div>
            {children && <div className="mt-4">{children}</div>}
        </Card>
    )
}