'use client'

import { useAuth } from "@/src/hooks/useAuth"
import { useCurrent } from "@/src/hooks/useCurrent"
import { LayoutDashboard, Loader, LogOut, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/common/DropdownMenu"
import { ChannelAvatar } from "../../ui/elements/ChannelAvatar"
import Link from "next/link"
import { useLogoutUserMutation } from "@/src/graphql/generated/output"
import { toast } from "sonner"
import { Notifications } from "./notifications/Notifications"

export function ProfileMenu() {
    const t = useTranslations('layout.headerMenu.profileMenu')
    const router = useRouter()

    const { exit } = useAuth()
    const { user, isLoadingProfile } = useCurrent()

    const [ logout ] = useLogoutUserMutation({
        onCompleted() {
            exit()
            toast.success(t('sucessMessage'))
            router.push('/account/login')
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    })

    return isLoadingProfile || !user ? (
        <Loader className="size-6 animate-spin text-(--muted-foreground)" />
    ) : (
        <>
        <Notifications />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <ChannelAvatar channel={user} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-57.5">
                    <div className="flex items-center gap-x-3 p-2">
                        <ChannelAvatar channel={user} />
                        <h2 className="font-medium text-(--foreground)">{user.username}</h2>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href={`/${user.username}`}>
                        <DropdownMenuItem>
                            <User className="mr-2 size-4" />
                            {t('channel')}
                        </DropdownMenuItem>
                    </Link>
                    <Link href='/dashboard/settings'>
                        <DropdownMenuItem>
                            <LayoutDashboard className="mr-2 size-4" />
                            {t('dashboard')}
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 size-4" />
                        {t('logout')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
