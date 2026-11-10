import { onLike } from '../../../lib/unnoticed.mjs'

interface Env {
  UNNOTICED_DB?: D1Database
}

export const onRequestPost: PagesFunction<Env> = (context) => onLike(context)
