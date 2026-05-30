'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/lib/stores/workspaceStore'
import { fetchWithAuth } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Loader2, MapPin } from 'lucide-react'

interface Workspace {
  business: {
    id: string
    name: string
    category: string
    location: string
  }
  role: 'owner' | 'manager' | 'viewer'
}

export default function WorkspaceSelectorPage() {
  const router = useRouter()
  const { setWorkspace } = useWorkspaceStore()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const data = await fetchWithAuth('/workspaces')
        setWorkspaces(data)
        
        // Auto-redirect if they have 0 workspaces
        if (data.length === 0) {
          router.push('/setup')
        }
      } catch (err) {
        console.error('Failed to load workspaces:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadWorkspaces()
  }, [router])

  const handleSelectWorkspace = (ws: Workspace) => {
    setWorkspace(ws.business.id, ws.business.name, ws.role)
    router.push(`/${ws.business.id}`) // Navigate to dashboard
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Select Workspace
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Choose a business context to continue
            </p>
          </div>
          <Button onClick={() => router.push('/setup')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Business
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <Card key={ws.business.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant={ws.role === 'owner' ? 'default' : 'secondary'} className="capitalize">
                    {ws.role}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl">{ws.business.name}</CardTitle>
                <CardDescription className="flex items-center mt-2 text-sm">
                  {ws.business.category || 'Business'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {ws.business.location && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="mr-1 h-3.5 w-3.5" />
                    {ws.business.location}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-4">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleSelectWorkspace(ws)}
                >
                  Enter Workspace
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
