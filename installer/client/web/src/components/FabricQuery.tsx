import * as React from 'react'
import { useStore } from '@nanostores/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { FabricText } from './fabricModes/FabricText'
import { FabricYoutube } from './fabricModes/FabricYoutube'
import { fetchFabricQuery } from './fabricModes/fetchFabricQuery'
import { Spinner } from './ui/spinner'
import { FabricTemperature } from './fabricModes/FabricTemperature'
import { currentQuery, updateQuery, spinner, runQuery } from '@/stores/fabricQuery'

const MODES = [
  {
    key: 'text',
    title: 'Document / Query Input',
    desc: '',
    component: FabricText,
  },
  {
    key: 'youtube',
    title: 'Youtube Transcript',
    desc: '',
    component: FabricYoutube,
  },
]

export function FabricQuery() {
  const $query = useStore(currentQuery)
  const $spinner = useStore(spinner)

  return (
    <Tabs defaultValue={MODES[0].key}>
      <TabsList className="grid w-full grid-cols-2">
        {MODES.map(({ key, title }) => (
          <TabsTrigger value={key} key={key} className="capitalize">
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
      {MODES.map(({ component, key, title, desc }) => (
        <TabsContent value={key} key={`tabcontent-${key}`}>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{React.createElement(component, { onUpdate: updateQuery })}</CardContent>
            <CardFooter>
              <FabricTemperature onUpdate={updateQuery} />
              <Button onClick={runQuery}>Run Fabric</Button>
              <Spinner size="medium" className="mx-4" show={$spinner} />
              {$spinner && `Running ${$query.pattern}...`}
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
