import { onWorks } from '../../../lib/unnoticed.mjs'

interface Env {
  UNNOTICED_DB?: D1Database
}

export const onRequestGet: PagesFunction<Env> = (context) => onWorks(context)
