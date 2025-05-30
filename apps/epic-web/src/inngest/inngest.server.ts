import {Inngest, EventSchemas} from 'inngest'

import {
  type LLMSuggestionsCreated,
  type NewTipVideo,
  type SRTReadyEvent,
  type TranscriptCreatedEvent,
  type EmailWritingRequested,
  EMAIL_WRITING_REQUESTED_EVENT,
  EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
  TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT,
  TIP_VIDEO_SRT_READY_EVENT,
  TIP_VIDEO_TRANSCRIPT_CREATED_EVENT,
  TIP_VIDEO_UPLOADED_EVENT,
  EmailWritingRequestCompleted,
  OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT,
  OauthProviderAccountLinked,
} from 'inngest/events'
import {
  CHARGE_REFUNDED_EVENT,
  ChargeRefunded,
  NEW_PURCHASE_CREATED_EVENT,
  NewPurchaseCreated,
  PURCHASE_STATUS_UPDATED_EVENT,
  PurchaseStatusUpdated,
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
  type StripeCheckoutCompleted,
  type StripeWebhookReceived,
} from '@skillrecordings/inngest'
import {
  LESSON_COMPLETED_EVENT,
  type LessonCompleted,
  PURCHASE_TRANSFERRED_EVENT,
  PurchaseTransferred,
} from '@skillrecordings/skill-lesson/inngest/events'
import {
  SANITY_WEBHOOK_EVENT,
  SanityWebhookEvent,
} from './functions/sanity/sanity-inngest-events'

export type IngestEvents = {
  [TIP_VIDEO_UPLOADED_EVENT]: NewTipVideo
  [TIP_VIDEO_TRANSCRIPT_CREATED_EVENT]: TranscriptCreatedEvent
  [TIP_VIDEO_SRT_READY_EVENT]: SRTReadyEvent
  [TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT]: LLMSuggestionsCreated
  [STRIPE_CHECKOUT_COMPLETED_EVENT]: StripeCheckoutCompleted
  [STRIPE_WEBHOOK_RECEIVED_EVENT]: StripeWebhookReceived
  [LESSON_COMPLETED_EVENT]: LessonCompleted
  [EMAIL_WRITING_REQUESTED_EVENT]: EmailWritingRequested
  [EMAIL_WRITING_REQUEST_COMPLETED_EVENT]: EmailWritingRequestCompleted
  [PURCHASE_TRANSFERRED_EVENT]: PurchaseTransferred
  [SANITY_WEBHOOK_EVENT]: SanityWebhookEvent
  [OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT]: OauthProviderAccountLinked
  [NEW_PURCHASE_CREATED_EVENT]: NewPurchaseCreated
  [PURCHASE_STATUS_UPDATED_EVENT]: PurchaseStatusUpdated
  [CHARGE_REFUNDED_EVENT]: ChargeRefunded
  'user/login': {}
  'user/created': {}
  'analytics/conversion': {}
}
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
