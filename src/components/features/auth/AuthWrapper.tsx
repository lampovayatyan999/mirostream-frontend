'use client'

import { PropsWithChildren } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/common/Card";
import Image from "next/image";
import Link from "next/link";
import { LogoImage } from "../../images/LogoImage";

interface AuthWrapperProps {
    heading: string
    backButtonLabel?: string
    backButtonHref?: string
}

export function AuthWrapper({children, heading, backButtonLabel, backButtonHref}: PropsWithChildren<AuthWrapperProps>) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-(--background) p-4">
            <Card className="w-full max-w-112.5 shadow-2xl bg-(--card) text-(--card-foreground) border-(--border)"> 
                <CardHeader className="flex flex-row items-center justify-start gap-x-4 px-6 pt-6">
                    <LogoImage />
                    <CardTitle className="text-xl font-semibold">
                        {heading}
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="px-6 py-4">
                    {children}
                </CardContent>

                <CardFooter className="flex flex-col gap-2 px-6 pb-6 bg-transparent border-none">
                    {backButtonLabel && backButtonHref && (
                        <div className="text-sm text-center w-full flex items-center justify-center gap-1">
                            <span className="text-(--muted-foreground)">
                                {backButtonLabel}
                            </span>
                            <Link 
                                href={backButtonHref} 
                                className="text-(--primary) hover:underline font-medium"
                            >
                                Войти
                            </Link>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
