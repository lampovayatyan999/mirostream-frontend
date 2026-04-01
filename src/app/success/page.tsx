import { Button } from "@/src/components/ui/common/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/common/Card";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";




export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('success')

    return {
        title: t('heading'),
        robots: {
            index: false,
            follow: false
        }
    }
}

export default async function SuccessPage(props: {
    searchParams: Promise<{
        price: number
        username: string
    }>
}) {
    const t = await getTranslations('success')

    const searchParams = await props.searchParams

    if(!searchParams || !searchParams.username) {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        {t('heading')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-semibold"></h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <span>
                                    {t('details.price')}
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span>
                                    {t('details.duration')} 1 месяц
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span>
                                    {t('details.channel')}{' '}{searchParams.username}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-center text-muted-foreground">
                        {t('congratulations')}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-4">
                        <Link href='/'>
                            <Button className='w-full'>
                                {t('backToHome')}
                            </Button>
                        </Link>
                        <Link href={`/${searchParams.username}`}>
                            <Button className='w-full' variant='secondary'>
                                {t('backToChannel')}
                            </Button>
                        </Link>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        {t('support')}
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}