import * as React from 'react'
import Markdown from 'marked-react'
import type { ExecuteOutput } from '../lib/execute'
import { Button } from './ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { nanoid } from 'nanoid'
import { useStore } from '@nanostores/react'
import { memory } from '@/stores/fabricMemory'
import { getMemory, type MemoryEntry } from '@/lib/localStorage'

const truncate = (str: string, maxlength: number) => {
  return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str
}

const title = (entry: MemoryEntry): string => {
  return truncate(entry.title || 'unknown', 50)
}

export const FabricMemory = () => {
  const $memory = useStore(memory)

  React.useEffect(() => {
    const local = getMemory()
    memory.set(local)
  }, [])

  if ($memory.length === 0) {
    return (
      <div>
        <code className="my-5">NO HISTORY FOUND</code>
      </div>
    )
  }
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <MemoryItems memory={$memory} />
      </Accordion>
    </div>
  )
}

const MemoryItems = ({ memory }: { memory: MemoryEntry[] }) => {
  return memory
    .slice()
    .reverse()
    .map((entry) => (
      <AccordionItem value={entry.id} key={entry.id}>
        <AccordionTrigger>
          {title(entry)} - {entry.pattern}
        </AccordionTrigger>
        <AccordionContent>
          <code className="block bg-indigo-950">{entry.command}</code>
          <code className="block opacity-50">Ran on {entry.date.toString()}</code>
          <div className="my-5 ">{entry.output && <Markdown>{entry.output.join('\n')}</Markdown>}</div>
        </AccordionContent>
      </AccordionItem>
    ))
}
