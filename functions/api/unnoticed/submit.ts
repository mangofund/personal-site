import { onSubmit } from '../../../lib/unnoticed.mjs'

interface Env {
  UNNOTICED_DB?: D1Database
  UNNOTICED_REVIEW_TOKEN?: string
}

export const onRequestPost: PagesFunction<Env> = (context) => onSubmit(context)
