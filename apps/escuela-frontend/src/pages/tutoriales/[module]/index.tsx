import React from 'react'
import {SanityDocument} from '@sanity/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import TutorialTemplate from 'templates/tutorial-template'
import {getAllTutorials, getTutorial} from '../../../lib/tutorials'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const tutorial = await getTutorial(params?.module as string)

  return {
    props: {tutorial},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tutorials = await getAllTutorials()
  const paths = tutorials.map((tutorial: any) => ({
    params: {module: tutorial.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const TutorialPage: React.FC<{
  tutorial: SanityDocument
}> = ({tutorial}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return <TutorialTemplate tutorial={tutorial} />
}

export default TutorialPage
