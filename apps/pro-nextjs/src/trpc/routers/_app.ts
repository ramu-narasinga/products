import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilities} from './abilities'
import {tipResourcesRouter} from './tip-resources'
import {tipsRouter} from './tips'

export const appRouter = mergeRouters(
  router({
    abilities: abilities,
    tipResources: tipResourcesRouter,
    tips: tipsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
