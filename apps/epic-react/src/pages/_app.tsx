import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import {MDXProvider} from '@mdx-js/react'
import {SessionProvider} from 'next-auth/react'
import * as amplitude from '@amplitude/analytics-browser'
import {FeedbackProvider} from '@/feedback-widget/feedback-context'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import config from '../config'
import {trpc} from '@/trpc/trpc.client'
import Script from 'next/script'
import {Session} from 'next-auth'
import {ThemeProvider} from '@/components/app/theme-provider'
import mdxComponents from '@/components/mdx-components'
import {Inter} from 'next/font/google'
import {GoldenTicketProvider} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'

if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
}

const isGoogleAnalyticsAvailable =
  process.env.NODE_ENV !== 'development' &&
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <FeedbackProvider>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ConvertkitProvider>
            <div
              id="app"
              className={`relative ${inter.variable} font-sans text-text antialiased`}
            >
              <MDXProvider components={mdxComponents}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <GoldenTicketProvider couponImageUrl="https://res.cloudinary.com/epic-web/image/upload/v1726823090/epic-react-golden-ticket_2x.jpg">
                    <Component {...pageProps} />
                  </GoldenTicketProvider>
                </ThemeProvider>
              </MDXProvider>
            </div>
          </ConvertkitProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </FeedbackProvider>
      {isGoogleAnalyticsAvailable && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          ></Script>
          <Script id="google-inline">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
          </Script>
        </>
      )}
    </>
  )
}

export default trpc.withTRPC(MyApp)
