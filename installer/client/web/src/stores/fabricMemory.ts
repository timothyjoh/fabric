import { saveMemory, type MemoryEntry } from '@/lib/localStorage'
import { atom } from 'nanostores'

export const memory = atom<MemoryEntry[]>([])
export const memoryLoading = atom(false)
export const memoryAdd = (slot: MemoryEntry) => {
  memory.set([...memory.get(), slot])
  saveMemory(memory.get())
}
