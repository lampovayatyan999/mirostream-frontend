import { FindProfileQuery } from "@/src/graphql/generated/output";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avart";
import { cn } from "@/src/utils/tw-merge";
import { getMediaSource } from "@/src/utils/get-media-source";
import { Check } from "lucide-react";

const channelVerifiedSizes = cva('', {
    variants: {
        size: {
            sm: 'size-3',
            default: 'size-4',
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


interface ChannelVerifiedProps extends VariantProps<typeof channelVerifiedSizes> {}

export function ChannelVerified({ size }: ChannelVerifiedProps) {
    return (
        <span className={cn(
            'flex items-center justify-center rounded-full bg-(--primary) shrink-0', 
            channelVerifiedSizes({size})
        )}>
            <Check className="size-full stroke-[4px] text-white p-0.5" />
        </span>
    )
}