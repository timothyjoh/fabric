import * as React from 'react'
import Markdown from 'marked-react'

import { Button } from './ui/button'
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FabricPatternSelect } from './FabricPatternSelect'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { fetchFabricQuery, fetchPatternDocument } from './customPatternQuery'

const queryClient = new QueryClient()

export function CustomPatternLoader() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomPatternColumns />
    </QueryClientProvider>
  )
}

export const CustomPatternColumns = () => {
  const [patternFile, setPatternFile] = React.useState('ai')
  const [patternBody, setPatternBody] = React.useState('')
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

  return (
    <>
      <FabricPatternSelect onChange={setPatternFile} />
      <Textarea
        placeholder="Custom Pattern"
        id="pattern_editor"
        className="h-full border-box font-code"
        rows={30}
        onChangeCapture={({ currentTarget }) => setPatternBody(currentTarget.value)}
        defaultValue={patternBody}
      />
      <Input
        title="Pattern File Name"
        id="pattern_file_name"
        onChangeCapture={({ currentTarget }) => setPatternFile(currentTarget.value)}
        value={patternFile}
      />
      <Button>Save Pattern</Button>
    </>
  )
}
