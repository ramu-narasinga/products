import groq from 'groq'
import z from 'zod'
import {ResourceSchema} from '../schemas/resource'
import {sanityClient} from '../utils/sanity-client'

export const LessonSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    visibility: z.enum(['public', 'paid', 'subscribed']).optional().nullable(),
    solution: z
      .nullable(
        z
          .object({
            _key: z.string(),
            visibility: z
              .enum(['public', 'paid', 'subscribed'])
              .optional()
              .nullable(),
          })
          .merge(ResourceSchema.omit({_id: true}))
          .optional(),
      )
      .optional(),
  })
  .merge(ResourceSchema)

export type Lesson = z.infer<typeof LessonSchema>

export const getLesson = async (slug: string): Promise<Lesson> => {
  const exercise = await sanityClient.fetch(
    `*[_type in ['lesson', 'exercise', 'explainer', 'tip', 'interview', 'talk'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      visibility,
      description,
      "slug": slug.current,
      body,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        visibility,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        "slug": slug.current,
      }
    }`,
    {slug},
  )

  return LessonSchema.parse(exercise)
}

export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessons =
    await sanityClient.fetch(groq`*[_type in ['lesson', 'exercise', 'explainer', 'interview']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      visibility,
      "slug": slug.current,
      "videoResourceId": resources[@->._type == 'videoResource'][0],
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        visibility,
        description,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0],
       "slug": slug.current
       }
    }`)

  return z.array(LessonSchema).parse(lessons)
}
