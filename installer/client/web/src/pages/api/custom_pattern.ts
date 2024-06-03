export const prerender = false

import { execute } from '@/lib/execute'
import type { APIContext } from 'astro'

export async function POST(context: APIContext) {
  const body = await context.request.json()
  const response = await execute(
    `cat <<'END_FABRIC_PATTERN' '${body.query}' END_FABRIC_PATTERN | fabric -p ${body.pattern} --temp 0.9`
  )
  return new Response(JSON.stringify(response))
}
