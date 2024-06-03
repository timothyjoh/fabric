import type { ExecuteOutput } from '../lib/execute'
export type FabricCustomQuery = { query: string; pattern: string }

const TEMP = 0.9
export const fetchFabricQuery = async (payload: FabricCustomQuery): Promise<ExecuteOutput> => {
  const response = await fetch('api/custom_pattern', {
    method: 'POST',
    body: JSON.stringify({ ...payload, temp: TEMP }),
  })
  const body = await response.json()
  return body
}

export const fetchPatternDocument = async (pattern: string): Promise<ExecuteOutput> => {
  const response = await fetch('api/load_pattern', {
    method: 'POST',
    body: JSON.stringify({ pattern }),
  })
  const body = await response.json()
  if (body.error) throw new Error(body.error)
  return body
}
