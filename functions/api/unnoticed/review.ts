import { onReviewGet, onReviewPost } from '../../../lib/unnoticed.mjs'

interface Env {
  UNNOTICED_DB?: D1Database
  UNNOTICED_REVIEW_TOKEN?: string
}

export const onRequestGet: PagesFunction<Env> = (context) => onReviewGet(context)
export const onRequestPost: PagesFunction<Env> = (context) => onReviewPost(context)
