import * as React from 'react'
import Navigation from 'components/app/navigation'
import Layout from 'components/app/layout'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Image from 'next/legacy/image'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {Video} from 'video/video'
import {GitHubLink} from '../video/exercise/github-link'
import {useRouter} from 'next/router'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {LargeScreenModuleLessonList} from 'video/large-screen-module-lesson-list'
import {MobileModuleLessonList} from 'video/mobile-module-lesson-list'
import {LessonDescription} from '../video/lesson-description'
import {LessonTitle} from 'video/lesson-title'
import {VideoTranscript} from 'video/video-transcript'
import {MuxPlayerRefAttributes} from '@mux/mux-player-react/*'
import {trpc} from '../trpc/trpc.client'
import LessonCompletionToggle from 'video/lesson-completion-toggle'
import {useSession} from 'next-auth/react'
import {useQueryClient} from '@tanstack/react-query'

const ExerciseTemplate: React.FC<{
  transcript: any[]
}> = ({transcript}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const router = useRouter()
  const {lesson, section, module} = useLesson()
  const {videoResourceId} = useVideoResource()
  const {title, description: exerciseDescription} = lesson

  const {ogImage, description: moduleDescription} = module
  const pageTitle = `${title}`
  const pageDescription = exerciseDescription || moduleDescription
  const shareCard = ogImage ? {ogImage: {url: ogImage}} : {}
  //TODO path here could also include module slug and section (as appropriate)
  const path = `/${module.moduleType}s`
  const {data: session} = useSession()

  const addProgressMutation = trpc.progress.add.useMutation()
  const client = useQueryClient()

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      path={path}
      onModuleEnded={async () => {
        addProgressMutation.mutate(
          {lessonSlug: router.query.lesson as string},
          {
            onSettled: () => {
              client.invalidateQueries()
            },
          },
        )
      }}
    >
      <Layout
        meta={{title: pageTitle, ...shareCard, description: pageDescription}}
        nav={
          <Navigation
            className="relative flex w-full lg:absolute lg:pl-[calc(280px+20px)] xl:pl-[calc(320px+20px)]"
            containerClassName="flex h-full justify-between w-full items-stretch"
            isMinified={true}
          />
        }
      >
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/${module.slug.current}/${lesson.slug}`}
          title={lesson.title}
          images={[
            `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
          ]}
          datePublished={lesson._updatedAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={pageDescription || ''}
        />
        <div className="flex flex-grow flex-col lg:flex-row">
          <LargeScreenModuleLessonList
            module={module}
            path={path}
            section={section}
          />
          <main className="relative mx-auto w-full max-w-[1480px] items-start border-t border-transparent lg:mt-16 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
            <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
              <Video ref={muxPlayerRef} />
              <MobileModuleLessonList
                module={module}
                section={section}
                path={path}
              />
              <div className="relative hidden flex-grow 2xl:block 2xl:bg-black/20">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
            </div>
            <article className="relative flex-shrink-0 sm:bg-black/20 2xl:bg-transparent">
              <div className="relative z-10 mx-auto max-w-4xl px-5 py-5 lg:py-6 2xl:max-w-xl">
                <LessonTitle />
                <GitHubLink exercise={lesson} module={module} />
                <LessonDescription />
                {(lesson._type === 'solution' ||
                  lesson._type === 'explainer') &&
                  session && <LessonCompletionToggle />}
              </div>
              <div className="relative z-10 block flex-grow 2xl:hidden">
                <VideoTranscript
                  transcript={transcript}
                  muxPlayerRef={muxPlayerRef}
                />
              </div>
              <Image
                src={require('../../public/assets/landing/bg-divider-6.png')}
                alt=""
                aria-hidden="true"
                layout="fill"
                objectFit="contain"
                objectPosition="center top"
                className="pointer-events-none z-0 select-none"
                priority
              />
            </article>
          </main>
        </div>
      </Layout>
    </VideoProvider>
  )
}

export default ExerciseTemplate
