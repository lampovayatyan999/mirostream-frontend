import { FindProfileQuery } from "@/src/graphql/generated/output";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avart";
import { cn } from "@/src/utils/tw-merge";
import { getMediaSource } from "@/src/utils/get-media-source";

const headingSizes = cva('', {
    variants: {
        size: {
            sm: 'text-lg',
            default: 'text-2xl',
            lg: 'text-4xl',
            xl: 'text-5xl'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


interface HeadingProps extends VariantProps<typeof headingSizes> {
    title: string
    description?: string
}

export function Heading({ size, title, description }: HeadingProps) {
    return <div className="space-y-2">
        <h1 className={cn('font-semibold text-(--foreground)', headingSizes({size}))}>{title}</h1>

        {description && <p className="text-(--muted-foreground)">{description}</p>}
    </div>
}


