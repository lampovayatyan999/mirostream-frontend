
'use server'

import { cookies } from "next/headers"
import { COOKIE_NAME, defaultLanguage, type Language } from "./config"

export async function getCurrentLanguage() {
    const cookiesStore = await cookies()
    const language = cookiesStore.get(COOKIE_NAME)?.value ?? defaultLanguage
    return language as Language
}

export async function setLanguage(language: Language) {
    const cookiesStore = await cookies()

    await cookiesStore.set(COOKIE_NAME, language, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    return { success: true }
}