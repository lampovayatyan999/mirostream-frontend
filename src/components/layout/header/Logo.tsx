'use client'

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { LogoImage } from "../../images/LogoImage";

export default function Logo() {
    const t = useTranslations('layout.logo')

    return (
        <Link href='/' className="flex items-center gap-x-4 transition-opacity hover:opacity-75">
            <LogoImage />
            <div className="hidden leading-light lg:block">
                <h2 className="text-lg font-semibold tracking-wider text-(--accent-foreground)">
                    MiroStream 
                </h2>
                <p className="text-sm text-(--muted-foreground)">{t('platform')}</p>
            </div>
        </Link>
    )
}

