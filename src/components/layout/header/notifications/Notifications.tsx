import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/common/Popover"
import { useFindUnreadNotificationsCountQuery } from "@/src/graphql/generated/output"
import { Bell } from "lucide-react"
import { NotificationsList } from "./NotificationsList"

export function Notifications() {
    const { data, loading:isLoadingCount} = useFindUnreadNotificationsCountQuery()
    const count = data?.findNotificationsUnreadCount ?? 0

    const displayCount = count > 10 ? '+9' : count

    if(isLoadingCount) return null
    
    return (
        <Popover>
            <PopoverTrigger>
                {count !== 0 && (
                    <div className="absolute right-18 top-5 rounded-full bg-(--primary) px-1.25 text-xs font-semibold text-white">{displayCount}</div>
                )}
                <Bell className="size-5 text-(--foreground)" />
            </PopoverTrigger>
            <PopoverContent align='end' className="max-h-125 w-[320px] overflow-y-auto">
                <NotificationsList />
            </PopoverContent>
        </Popover>
    )
}
