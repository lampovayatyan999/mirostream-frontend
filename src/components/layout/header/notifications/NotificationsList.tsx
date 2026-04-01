import { Separator } from "@/src/components/ui/common/Separator"
import { useFindNotificationsByUserQuery, useFindUnreadNotificationsCountQuery } from "@/src/graphql/generated/output"
import { getNotificationIcon } from "@/src/utils/get-notification-icon"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Fragment, useEffect } from "react"
import parse from 'html-react-parser'

export function NotificationsList() {
    const t = useTranslations('layout.headerMenu.profileMenu.notifications')
    const { refetch } = useFindUnreadNotificationsCountQuery()

    const { data, loading: isLoadingNotifications } = useFindNotificationsByUserQuery()

    useEffect(() => {
        if (data?.findNotificationsByUser) {
            refetch()
        }
    }, [data, refetch])

    const notifications = data?.findNotificationsByUser ?? []

    return (
        <>
            <h2 className='text-center text-lg font-medium'>{t('heading')}</h2>
            <Separator className='my-3' />
            {isLoadingNotifications ? (
                <div className='flex items-center justify-center gap-x-2 text-sm text-(--foreground)'>
                    <Loader2 className='size-5 animate-spin' />
                    {t('loading')}
                </div>
            ) : notifications.length ? (
                notifications.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type)

                    return (
                        <Fragment key={index}>
                            <div className='flex items-center gap-x-3 text-sm'>
                                <div className='rounded-full bg-(--foreground) p-2'>
                                    <Icon className="size-6 text-secondary" />
                                </div>
                                <div>
                                    {parse(notification.message)}
                                </div>
                            </div>
                            {index < notifications.length - 1 && (
                                <Separator className="my-3" />
                            )}
                        </Fragment>
                    )
                })
            ) : (
                <div className='text-center text-(--muted-foreground)'>
                    {t('empty')}
                </div>
            )}
        </>
    )
}
