import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'owner' | 'manager' | 'viewer'

interface WorkspaceState {
  activeBusinessId: string | null
  activeBusinessName: string | null
  activeRole: Role | null
  setWorkspace: (id: string, name: string, role: Role) => void
  clearWorkspace: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeBusinessId: null,
      activeBusinessName: null,
      activeRole: null,
      setWorkspace: (id, name, role) => set({ activeBusinessId: id, activeBusinessName: name, activeRole: role }),
      clearWorkspace: () => set({ activeBusinessId: null, activeBusinessName: null, activeRole: null }),
    }),
    {
      name: 'byaper-workspace-storage',
    }
  )
)
