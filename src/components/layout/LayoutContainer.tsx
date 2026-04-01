'use client'

import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { useSidebar } from "@/src/hooks/useSidebar";
import { cn } from "@/src/utils/tw-merge";
import { useEffect, type PropsWithChildren } from "react";

export function LayoutContainer({children}: PropsWithChildren<unknown>) {
    const isMobile = useMediaQuery('(max-width: 1024px)')

    const {isCollapsed, open, close} = useSidebar()

    useEffect(() => {
        if (isMobile) {
            if (!isCollapsed) close()
        } else {
            if (isCollapsed) open()
        }
    }, [isMobile])
    
    return (
        <main className={cn(
            "mt-18.75 flex-1 p-8 transition-all duration-200 ease-in-out",
            isMobile ? "ml-0" : (isCollapsed ? "ml-16" : "ml-64")
        )}>{children}</main>
    )
}