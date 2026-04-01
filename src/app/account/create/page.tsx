import { CreateAccountForm } from '@/src/components/features/auth/forms/CreateAccountForm';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'auth.register' });
    
    return {
        title: t("heading")
    };
}

export default function CreateAccountPage() {
    return <CreateAccountForm />;
}