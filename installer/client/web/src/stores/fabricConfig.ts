import { atom } from 'nanostores'

export const modelList = atom<string[]>([])
export const currentModel = atom<string>('')
export const configResponse = atom<string>('')
