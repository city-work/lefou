'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import PanelContent from './PanelContent'

export type PanelId =
  | 'dashboard'
  | 'masterlist'
  | 'chores'
  | 'commercial'
  | 'cps'
  | 'concert'
  | 'weekly'
  | 'classics'

export default function DashboardShell({ userEmail }: { userEmail: string }) {
  const [activePanel, setActivePanel] = useState<PanelId>('dashboard')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mist">
      <Sidebar activePanel={activePanel} onNavigate={setActivePanel} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePanel={activePanel} userEmail={userEmail} />
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <PanelContent panel={activePanel} userEmail={userEmail} />
        </div>
      </div>
    </div>
  )
}