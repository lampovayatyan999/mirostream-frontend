import { getLocale, getMessages } from "next-intl/server";
import "@/src/styles/globals.css";
import '@/src/styles/themes.css'
import { ApolloClientProvider } from "../providers/ApolloClientProvider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "../providers/ThemeProvider";
import { ToastProvider } from "../providers/ToastProviders";
import { GeistSans } from "geist/font";
import { ColorSwitcher } from "../components/ui/elements/ColorSwitcher";
import { SITE_DESCRIPTION, SITE_NAME } from "../libs/constants/seo.constants";
import { APP_URL } from "../libs/constants/url.constants";

export const metadata = {
  title: {
    absoulte: SITE_NAME,
    template: '%s - ' + SITE_NAME
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  applicationName: SITE_NAME,
  authors: [{ name: 'lampovayatyan999', url: new URL('https://github.com/lampovayatyan999') }],
  keywords: ['MiroStream', 'Next.js', 'TypeScript', 'GraphQL', 'WebSocket', 'Apollo Client', 'Internationalization', 'Theming', 'Toast Notifications'],
  generator: 'Next.js',
  creator: 'lampovayatyan999',
  publisher: 'lampovayatyan999',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/touch-icons/256x256.png',
    other: {
      rel: '/touch-icons',
      url: '/touch-icons/256x256.png',
      sizes: '256x256',
      type: 'image/png'
    }
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    emails: ['help@mirostream.ru'],
    locale: 'ru_RU',
    url: APP_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/touch-icons/512x512.png',
        width: 512,
        height: 512,
        alt: SITE_NAME
      }
    ]
  }

};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={GeistSans.variable}>
        <ApolloClientProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              disableTransitionOnChange
            >
              <ColorSwitcher />
              <ToastProvider />
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </ApolloClientProvider>
      </body>
    </html>
  )
}