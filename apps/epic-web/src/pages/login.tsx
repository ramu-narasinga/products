import React from 'react'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/skill-lesson/templates/login'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}

const LoginPage: React.FC<LoginTemplateProps> = ({csrfToken, providers}) => {
  return (
    <Layout meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}>
      <LoginTemplate
        csrfToken={csrfToken}
        providers={providers}
        title="Log in to Epic Web"
        image={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-16 text-foreground"
            fill="none"
            viewBox="0 0 70 70"
          >
            <path
              fill="url(#markGradient)"
              d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
            />
            <path
              fill="currentColor"
              d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
            />
            <defs>
              <linearGradient
                id="markGradient"
                x1="49.496"
                x2="20.585"
                y1="20.504"
                y2="49.431"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4F75FF" />
                <stop offset="1" stopColor="#30AFFF" />
              </linearGradient>
            </defs>
          </svg>
        }
      />
    </Layout>
  )
}

export default LoginPage
