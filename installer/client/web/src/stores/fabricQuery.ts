import {
  defaultFabricQueryProps,
  fetchFabricQuery,
  type FabricQueryProps,
} from '@/components/fabricModes/fetchFabricQuery'
import { atom } from 'nanostores'
import { memoryAdd } from './fabricMemory'
import { nanoid } from 'nanoid'

export const currentQuery = atom<FabricQueryProps>(defaultFabricQueryProps)
export const updateQuery = (part: Partial<FabricQueryProps>) => {
  currentQuery.set({ ...currentQuery.get(), ...part })
}
export const spinner = atom(false)

export const runQuery = async () => {
  const q = currentQuery.get()
  console.log({ runFabricQuery: new Date(), q })
  spinner.set(true)
  const response = await fetchFabricQuery(q)
  console.log({ response })
  memoryAdd({
    id: nanoid(),
    date: new Date(),
    title: q.query || q.youtubeUrl,
    pattern: q.pattern,
    command: response.command,
    output: response.ok ? response.data : response.error,
  })
  spinner.set(false)
}
