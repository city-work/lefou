'use client'

import { PanelId } from './DashboardShell'

const titles: Record<PanelId, string> = {
  dashboard: 'Dashboard',
  masterlist: 'Masterlist',
  chores: 'Daily Chores',
  commercial: 'Commercial',
  cps: 'CPS',
  concert: 'Concert Schedule',
  weekly: 'Weekly Schedule',
  classics: 'Classics',
}

export default function Header({
  activePanel,
  userEmail,
}: {
  activePanel: PanelId
  userEmail: string
}) {
  return (
    <header className="h-[60px] shrink-0 flex items-center justify-between px-6 bg-white/40 backdrop-blur-md border-b border-midnight/5">
      <h1 className="text-sm font-bold text-midnight">{titles[activePanel]}</h1>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-xs text-slateblue truncate max-w-[180px]">
          {userEmail}
        </span>
        <div className="w-8 h-8 rounded-full bg-copper text-white flex items-center justify-center text-xs font-bold">
          {userEmail.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}