export default {
  title: `${process.env.NEXT_PUBLIC_SITE_TITLE}`,
  description: process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION,
  author: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
  authorBio:
    'Matt is a well-regarded TypeScript expert known for his ability to demystify complex TypeScript concepts.',
  additionalLinkTags: [
    {
      rel: 'icon',
      href: `${process.env.NEXT_PUBLIC_URL}/favicon.ico`,
    },
  ],
  additionalMetaTags: [
    {
      property: 'author',
      content: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
    },
    {
      property: 'keywords',
      content: process.env.NEXT_PUBLIC_SEO_KEYWORDS,
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: `@${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`,
  },
  openGraph: {
    type: 'website',
    site_name: process.env.NEXT_PUBLIC_SITE_TITLE,
    profile: {
      firstName: process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME,
      lastName: process.env.NEXT_PUBLIC_PARTNER_LAST_NAME,
    },
    images: [
      {
        url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/card2x.png?date=06/11/23`,
        width: 1200,
        height: 630,
      },
    ],
  },
}
