'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ChevronsUpDown, Check, PlusCircle } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Role, useWorkspaceStore } from '@/lib/stores/workspaceStore'
import { fetchWithAuth } from '@/lib/api'

type Workspace = {
  business: {
    id: string
    name: string
  }
  role: Role
}

export function WorkspaceSwitcher() {
  const router = useRouter()
  const { activeBusinessId, activeBusinessName, activeRole, setWorkspace } = useWorkspaceStore()
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])

  React.useEffect(() => {
    fetchWithAuth('/workspaces').then(data => setWorkspaces(data as Workspace[])).catch(console.error)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-[250px] items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {activeBusinessName?.charAt(0) || <Building2 className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate">
            <span className="text-sm font-semibold truncate max-w-[150px]">{activeBusinessName || 'Select Workspace'}</span>
            <span className="text-xs text-gray-500 capitalize">{activeRole}</span>
          </div>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] p-0" align="start">
        <DropdownMenuLabel className="text-xs text-gray-500">Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.business.id}
            onClick={() => {
              setWorkspace(ws.business.id, ws.business.name, ws.role)
              router.push(`/${ws.business.id}`)
            }}
            className="flex items-center gap-2 cursor-pointer p-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                {ws.business.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{ws.business.name}</span>
            </div>
            {activeBusinessId === ws.business.id && (
              <Check className="ml-auto h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/setup')}
          className="cursor-pointer p-2 text-blue-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Business
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
