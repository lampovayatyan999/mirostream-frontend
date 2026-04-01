'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/common/Tabs"
import { Heading } from "@/src/components/ui/elements/Headings"
import { useTranslations } from "next-intl"
import { ChangeAvatarForm } from "./profile/ChangeAvatarForm"
import { useEffect, useState } from "react"
import { ChangeInfoForm } from "./profile/ChangeInfoForm"
import { SocialLinksForm } from "./profile/social-links-form/SocialLinksForm"
import { ChangeEmailForm } from "./account/ChangeEmailForm"
import { ChangePasswordForm } from "./account/ChangePasswordForm"
import { WrapperTotp } from "./account/totp/WrapperTotp"
import { DeactivateCard } from "./account/totp/DeactivateCard"
import { ChangeThemeForm } from "./appearance/ChangeThemeForm"
import { ChangeLanguageForm } from "./appearance/ChangeLanguageForm"
import { ChangeColorForm } from "./appearance/ChangeColorForm"
import { ChangeNotificationsSettingsForm } from "./notifications/ChangeNotificationsSettingsForm"
import { SessionsList } from "./sessions/SessionsList"

export function UserSettings() {
    const t = useTranslations('dashboard.settings')

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return <div className="lg:px-10">
        <Heading 
            title={t('header.heading')} 
            description={t('header.description')}
            size="lg"
        />
        <Tabs defaultValue="profile" className="mt-3 w-full">
            <TabsList className="grid max-w-3xl grid-cols-5">
                <TabsTrigger value="profile">{t('header.profile')}</TabsTrigger>
                <TabsTrigger value="account">{t('header.account')}</TabsTrigger>
                <TabsTrigger value="appearance">{t('header.appearance')}</TabsTrigger>
                <TabsTrigger value="notifications">{t('header.notifications')}</TabsTrigger>
                <TabsTrigger value="sessions">{t('header.sessions')}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
                <div className="mt-5 space-y-6">
                    <Heading title={t('profile.header.heading')} description={t('profile.header.description')}/>
                    <ChangeAvatarForm />
                    <ChangeInfoForm />
                    <SocialLinksForm />
                </div>
            </TabsContent>
            <TabsContent value="account">
                <div className="mt-5 space-y-6">
                    <Heading title={t('account.header.heading')} description={t('account.header.description')} />
                    <ChangeEmailForm />
                    <ChangePasswordForm />
                    <Heading title={t('account.header.securityHeading')} description={t('account.header.deactivationHeading')} />
                    <WrapperTotp />
                    <Heading title={t('account.header.securityHeading')} description={t('account.header.deactivationDescription')} />
                    <DeactivateCard />
                </div>
            </TabsContent>
            <TabsContent value="appearance">
                <div className="mt-5 space-y-6">
                    <Heading title={t('appearance.header.heading')} description={t('appearance.header.description')} />
                    <ChangeThemeForm />
                    <ChangeLanguageForm />
                    <ChangeColorForm />
                </div>
            </TabsContent>
            <TabsContent value="notifications">
                <div className="mt-5 space-y-6">
                    <Heading title={t('notifications.header.heading')} description={t('notifications.header.description')} />
                    <ChangeNotificationsSettingsForm />
                </div>
            </TabsContent>
            <TabsContent value="sessions">
                <div className="mt-5 space-y-6">
                    <Heading title={t('sessions.header.heading')} description={t('sessions.header.description')} />
                    <SessionsList />
                </div>
            </TabsContent>
        </Tabs>
    </div>
}