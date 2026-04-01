'use client'

import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { Button } from "../../ui/common/Button";
import { useTranslations } from "next-intl";
import { ProfileMenu } from "./ProfileMenu";
import { useCurrent } from "@/src/hooks/useCurrent";


export function HeaderMenu() {
    const t = useTranslations('layout.headerMenu');
    const { user, isLoadingProfile } = useCurrent(); 

    if (isLoadingProfile) return <div className="ml-auto">...</div>;

    return (
        <div className="ml-auto flex items-center gap-x-4">
            {user ? (
                <ProfileMenu /> 
            ) : (
                <>
                    <Link href='/account/login'>
                        <Button variant='secondary'>{t('login')}</Button>
                    </Link>
                    <Link href='/account/create'>
                        <Button variant='secondary'>{t('register')}</Button>
                    </Link>
                </>
            )}
        </div>
    );
}