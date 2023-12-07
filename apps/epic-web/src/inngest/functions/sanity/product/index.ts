import groq from 'groq'
import z from 'zod'
import {sanityProductCreated} from './sanity-product-created'
import {sanityProductUpdated} from './sanity-product-updated'
import {sanityProductDeleted} from './sanity-product-deleted'
import {sanityWriteClient} from 'utils/sanity-server'

export const sanityProductFunctions = [
  sanityProductCreated,
  sanityProductUpdated,
  sanityProductDeleted,
]

export const loadSanityProduct = async (id: string) => {
  const sanityProductData = await sanityWriteClient.fetch(
    groq`*[_type == "product" && _id == $id][0] {
          _id,
          productId,
          unitAmount,
          title,
          "slug": slug.current,
          quantityAvailable,
          upgradableTo[]->{
            _id,
            productId
          },
          features[]{
            value,
            icon
          },
          image{
            url
          }
    }`,
    {id},
  )
  return BaseSanityProductSchema.parse(sanityProductData)
}

export const BaseSanityProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  unitAmount: z.number().default(0),
  quantityAvailable: z.number().default(-1),
  productId: z.string().nullable().optional(),
  upgradableTo: z
    .array(z.object({productId: z.string()}))
    .nullable()
    .optional(),
  features: z
    .array(
      z.object({
        value: z.string(),
        icon: z.string(),
      }),
    )
    .nullable()
    .optional(),
  image: z
    .object({
      url: z.string(),
    })
    .nullable()
    .optional(),
})

export type BaseSanityProduct = z.infer<typeof BaseSanityProductSchema>
