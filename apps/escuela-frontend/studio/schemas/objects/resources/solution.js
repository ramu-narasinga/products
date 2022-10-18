import {MdAutoFixHigh} from 'react-icons/md'

export default {
  name: 'solution',
  type: 'object',
  title: 'Solution to lesson',
  icon: MdAutoFixHigh,
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      hidden: true,
    },
    {
      name: 'solutionType',
      title: 'Solution Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Solución al Desafío', value: 'lessonSolution'},
          {title: 'Solución al Crédito Extra', value: 'extraCreditSolution'},
        ],
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(90),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {
          title: 'Video Resource',
          type: 'reference',
          to: [{type: 'videoResource'}],
        },
        {type: 'stackblitz'},
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'description',
      title: 'Summary',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
}
