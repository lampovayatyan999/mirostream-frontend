import LoginForm from '@/src/components/features/auth/forms/LoginForm';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'auth.login' });
    
    return {
        title: t("heading")
    };
}

export default function LoginPage() {
    return <LoginForm />;
}