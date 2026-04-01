'use client'

import { useSidebar } from "@/src/hooks/useSidebar"
import { cn } from "@/src/utils/tw-merge"
import { SidebarHeader } from "./SidebarHeader"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DashboardNav } from "./DashboardNav"
import { UserNav } from "./UserNav"

export function Sidebar() {
    const { isCollapsed } = useSidebar()
    
    const pathname = usePathname()

    const isDashboardPage = pathname.includes('/dashboard')

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <aside className="fixed left-0 z-50 mt-18.75 flex h-full flex-col border-r border-(--border) bg-(--card) text-(--card-foreground) w-64" />
    }

    return (
        <aside className={cn(
            'fixed left-0 z-50 mt-18.75 flex h-full flex-col border-r border-(--border) bg-(--card) text-(--card-foreground) transition-all duration-100 ease-in-out', 
            isCollapsed ? 'w-16' : 'w-64'
        )}>
            <SidebarHeader />
            {isDashboardPage ? <DashboardNav /> : <UserNav />}
        </aside>
    )
}