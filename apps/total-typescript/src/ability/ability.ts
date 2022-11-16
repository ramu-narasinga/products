import {Ability, AbilityBuilder, AbilityClass} from '@casl/ability'
import {Exercise} from '../lib/exercises'
import {SanityDocument} from '@sanity/client'
import z from 'zod'
import {Purchase} from '@skillrecordings/database'

function hasBulkPurchase(purchases?: Purchase[]) {
  return purchases?.some((purchase) => Boolean(purchase.bulkCouponId))
}

// Copied from: packages/ability/src/purchase-validators.ts
//
// function bulkCouponHasSeats(coupon: Coupon) {
//   return coupon && coupon.usedCount < coupon.maxUses
// }
//
// function hasAvailableSeats(purchases?: any[]) {
//   return purchases?.some(
//     (purchase) =>
//       Boolean(purchase.bulkCoupon) && bulkCouponHasSeats(purchase.bulkCoupon),
//   )
// }

// function hasValidPurchase(purchases?: any[]) {
//   return purchases?.some((purchase) => {
//     return purchase && !Boolean(purchase.bulkCoupon)
//   })
// }

// function hasInvoice(purchases?: any[]) {
//   return purchases?.some((purchase) => Boolean(purchase.merchantChargeId))
// }

const adminRoles = ['ADMIN', 'SUPERADMIN']

export const UserSchema = z.object({
  role: z.string().optional(),
  purchases: z.array(z.any()),
  id: z.string(),
  name: z.nullable(z.string().optional()),
  email: z.string(),
})

export type User = z.infer<typeof UserSchema>

type Actions = 'manage' | 'invite' | 'view'
type Subjects =
  | 'Team'
  | 'Purchase'
  | 'Content'
  | 'Lesson'
  | 'Module'
  | 'Product'
  | 'Invoice'
  | 'Account'
  | 'all'
export type AppAbility = Ability<[Actions, Subjects]>
export const AppAbility = Ability as AbilityClass<AppAbility>

type ViewerAbilityInput = {
  user?: User
  subscriber?: any
  lesson?: Exercise
  module: SanityDocument
  section?: SanityDocument
  isSolution?: boolean
}

export function defineRulesForPurchases(
  viewerAbilityInput: ViewerAbilityInput,
) {
  const {can, rules} = new AbilityBuilder(AppAbility)
  const {
    section,
    module,
    lesson,
    subscriber,
    user,
    isSolution = false,
  } = viewerAbilityInput

  console.log({user})

  if (hasBulkPurchase(user?.purchases)) {
    can('view', 'Team')
  }

  const exercises = section ? section.exercises : module.exercises
  const isFirstLesson =
    lesson?._type === 'exercise' && lesson._id === exercises?.[0]._id

  const hasVideo = Boolean(lesson?.muxPlaybackId)

  const isFreelyVisible = isFirstLesson && hasVideo && !isSolution

  if (module.moduleType === 'tutorial') {
    if (user || subscriber || (!section && isFreelyVisible)) {
      can('view', 'Content')
    }
  }

  if (isFreelyVisible) {
    can('view', 'Content')
  }

  if (module.moduleType === 'workshop') {
    // TODO remove this once we have a better way to determine if a workshop is
    //  available to the user (see below)
    const userHasPurchases = Boolean(user && user.purchases.length > 0)
    if (userHasPurchases && hasVideo) {
      can('view', 'Content')
    }

    // TODO a given module is associated with a product
    //  if the user has a valid purchase of that product
    //  they can view the content of the lesson
    // if (hasValidPurchase(user?.purchases)) {
    //   can('view', 'Account')
    //   can('view', 'Content')
    //   can('view', 'Product', {
    //     productId: {
    //       $in: user?.purchases?.map(
    //         (purchase: any) => purchase.productId && purchase.status === 'Valid',
    //       ),
    //     },
    //   })
    // }
  }

  // adminRoles.includes(user?.role || '') && can('manage', 'all')

  return rules
}

export function getCurrentAbility(
  viewerAbilityInput: ViewerAbilityInput,
): AppAbility {
  return new AppAbility(defineRulesForPurchases(viewerAbilityInput))
}
