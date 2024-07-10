import * as React from 'react'
import { saveMemory } from '../lib/localStorage'
import { Button } from './ui/button'

export const ClearFabricMemory = () => {
  const clear = () => {
    saveMemory([])
  }
  return (
    <Button onClick={clear} className="block">
      Clear all Memory
    </Button>
  )
}
