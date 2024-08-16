import React from 'react'
import ExerciseTemplate from '@/templates/exercise-template'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getExercise} from '@/lib/exercises'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {serialize} from 'next-mdx-remote/serialize'
import {removePreContainerDivs, trimCodeBlocks} from '@/utils/mdx'
import * as Sentry from '@sentry/nextjs'
import {
  getAllWorkshops,
  getModuleLessonPath,
  getWorkshop,
} from '@/lib/workshops'
import {remarkCodeBlocksShiki} from '@kentcdodds/md-temp'
import {getSection} from '@/lib/sections'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string
  const sectionSlug = params?.section as string

  const module = await getWorkshop(params?.module as string)
  const section = await getSection(sectionSlug)
  const lesson = await getExercise(lessonSlug, false)

  if (!lesson) {
    const msg = `Unable to find Exercise for slug (${lessonSlug}). Context: module (${params?.module}) and section (${sectionSlug})`
    Sentry.captureMessage(msg)

    return {
      notFound: true,
    }
  }

  const lessonBodySerialized =
    typeof lesson.body === 'string' &&
    (await serialize(lesson.body, {
      mdxOptions: {
        rehypePlugins: [
          trimCodeBlocks,
          removePreContainerDivs,
          remarkCodeBlocksShiki,
        ],
      },
    }))

  return {
    props: {
      lesson,
      lessonBodySerialized,
      lessonBodyPreviewSerialized: lessonBodySerialized,
      module,
      section,
      transcript: lesson.transcript,
      videoResourceId: lesson.videoResourceId,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const workshops = await getAllWorkshops()

  // TODO this won't handle top level lessons
  const paths = workshops.flatMap((tutorial: any) => {
    return (
      tutorial.sections?.flatMap((section: any) => {
        return (
          section.lessons?.map((lesson: any) => ({
            params: {
              module: tutorial.slug.current,
              lesson: lesson.slug,
            },
          })) || []
        )
      }) || []
    )
  })

  return {paths, fallback: 'blocking'}
}

const ExercisePage: React.FC<any> = ({
  lesson,
  lessonBodySerialized,
  lessonBodyPreviewSerialized,
  module,
  section,
  transcript,
  videoResourceId,
}) => {
  return (
    <ModuleProgressProvider moduleSlug={module.slug.current}>
      <LessonProvider lesson={lesson} module={module} section={section}>
        <VideoResourceProvider videoResourceId={videoResourceId}>
          <ExerciseTemplate
            transcript={transcript}
            lessonBodySerialized={lessonBodySerialized}
            lessonBodyPreviewSerialized={lessonBodyPreviewSerialized}
            lessonPathBuilder={getModuleLessonPath}
          />
        </VideoResourceProvider>
      </LessonProvider>
    </ModuleProgressProvider>
  )
}

export default ExercisePage
