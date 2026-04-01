'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ApolloClientProvider } from './ApolloClientProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProviders'

export function Providers({ children, locale, messages }: { children: React.ReactNode, locale: string, messages: Record<string, unknown> }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <ApolloClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          {children}
        </ThemeProvider>
      </ApolloClientProvider>
    </NextIntlClientProvider>
  )
}