declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    NEXT_PUBLIC_SITE_TITLE: string
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_URL: string
    NEXT_PUBLIC_PARTNER_FIRST_NAME: string
    NEXT_PUBLIC_PARTNER_LAST_NAME: string
    NEXT_PUBLIC_PARTNER_TWITTER: string
    NEXT_PUBLIC_SEO_KEYWORDS: string
    NEXT_PUBLIC_PRODUCT_DESCRIPTION: string
    NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM: string
    NEXT_PUBLIC_CONVERTKIT_TOKEN: string
    NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY: string
    NEXT_PUBLIC_SUPPORT_EMAIL: string
    CONVERTKIT_BASE_URL: string
    NEXT_PUBLIC_GOOGLE_ANALYTICS: string
    NEXT_PUBLIC_DEFAULT_OG_IMAGE_URL: string
    NEXT_PUBLIC_SANITY_PROJECT_ID: string
    NEXT_PUBLIC_SANITY_DATASET_ID: string
    NEXT_PUBLIC_SANITY_API_VERSION: string
    SANITY_WEBHOOK_SECRET: string
    CASTINGWORDS_API_TOKEN: string
    EMAIL_SERVER_HOST: string
    EMAIL_SERVER_PORT: number
    POSTMARK_KEY: string
    NEXT_PUBLIC_PRODUCT_NAME: string
    STRIPE_SECRET_TOKEN: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    CLOUDINARY_VIDEO_BUCKET_NAME: string
    GITHUB_SECRET: string
    GITHUB_ID: string
    DISCORD_CLIENT_ID: string
    DISCORD_CLIENT_SECRET: string
    DISCORD_ROLE_ER_V1: string
    DISCORD_ROLE_ER_V2: string
    DISCORD_GUILD_ID: string
    NEXT_PUBLIC_DEFAULT_PRODUCT_ID: string
    SLACK_EMAIL_POST_CHANNEL: string
    SLACK_INVOICE_POST_CHANNEL: string
  }
}
