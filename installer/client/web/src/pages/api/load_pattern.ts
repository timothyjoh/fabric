export const prerender = false

import { execute } from '@/lib/execute'
import type { APIContext } from 'astro'

export async function POST(context: APIContext) {
  const body = await context.request.json()
  const patternFile = await execute(`cat ~/.config/fabric/patterns/${body.pattern}/system.md`)
  return new Response(JSON.stringify(patternFile))
}
