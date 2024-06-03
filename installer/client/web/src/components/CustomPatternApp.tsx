import * as React from 'react'
import { nanoid } from 'nanoid'
import Markdown from 'marked-react'

import type { ExecuteOutput } from '../lib/execute'
import { getMemory, saveMemory } from '../lib/localStorage'
import type { FabricQueryProps } from './fabricModes/fetchFabricQuery'
import { ModeSelectTabs } from './fabricModes/ModeSelect'
import { FabricMemory } from './FabricMemory'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { FabricModelSelect } from './FabricModelSelect'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FabricPatternSelect } from './FabricPatternSelect'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { fetchFabricQuery, fetchPatternDocument } from './customPatternQuery'

const queryClient = new QueryClient()

export function CustomPatternApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomPatternColumns />
    </QueryClientProvider>
  )
}

export const CustomPatternColumns = () => {
  const [patternFile, setPatternFile] = React.useState('ai')
  const [patternBody, setPatternBody] = React.useState('')
  const [documentBody, setDocumentBody] = React.useState('')
  const [output, setOutput] = React.useState([] as string[])
  const queryClient = useQueryClient()

  React.useEffect(() => {
    const getPatternDoc = async () => {
      const patternDoc = await fetchPatternDocument(patternFile)
      if (patternDoc.ok) {
        setPatternBody(patternDoc.data?.join('\n'))
      }
    }
    getPatternDoc()
  }, [patternFile])

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['pattern_document'],
    queryFn: () => fetchPatternDocument(patternFile),
  })

  const runFabric = async () => {
    const llm_output = await fetchFabricQuery({
      pattern: patternFile,
      query: documentBody,
    })
    if (llm_output.ok) setOutput(llm_output.data)
  }
  // const [latest, setLatest] = React.useState(nanoid() as string)
  // const memory = React.useMemo(() => {
  //   const mem = getMemory()
  //   // onLoaded()
  //   return mem
  // }, [latest])

  // const onResult = async (query: FabricQueryProps, response: ExecuteOutput) => {
  //   setLatest(nanoid())
  //   memory.push({
  //     id: latest,
  //     date: new Date(),
  //     title: query.query || query.youtubeUrl,
  //     pattern: query.pattern,
  //     command: response.command,
  //     output: response.ok ? response.data : response.error,
  //   })
  //   saveMemory(memory)
  //   setOutput(response)
  // }
  return (
    <div className="grid h-full grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Customize the Pattern</CardTitle>
          <CardDescription>Load an existing pattern to customize</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col">
            <div className="flex-none">
              <FabricPatternSelect onChange={(v) => setPatternFile(v)} />
            </div>
            <div className="grow">
              <Textarea
                placeholder="Custom Pattern"
                id="pattern_editor"
                className="h-full border-box"
                rows={30}
                onChangeCapture={({ currentTarget }) => setPatternBody(currentTarget.value)}
                defaultValue={patternBody}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Input
            title="Pattern File Name"
            id="pattern_file_name"
            onChangeCapture={({ currentTarget }) => setPatternFile(currentTarget.value)}
            value={patternFile}
          />
          <Button>Save Pattern</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Paste your INPUT</CardTitle>
          <CardDescription>This is the source document you will run your Fabric pattern upon.</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col">
            <div className="grow">
              <Textarea
                placeholder="Source Document"
                id="document"
                className="h-full border-box"
                rows={30}
                onChangeCapture={({ currentTarget }) => setDocumentBody(currentTarget.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Run Fabric</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Test the LLM</CardTitle>
          <CardDescription>
            <FabricModelSelect />
            <Button onClick={runFabric}>Run Fabric</Button>
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col">
            <Markdown>{output.join('\n')}</Markdown>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  )
}

const ClearFabricMemory = () => {
  const clear = () => {
    saveMemory([])
  }
  return (
    <Button onClick={clear} className="block">
      Clear all Memory
    </Button>
  )
}
