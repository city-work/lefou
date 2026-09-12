'use client'

import { PanelId } from './DashboardShell'

const panels: { id: PanelId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'masterlist', label: 'Masterlist', icon: '📋' },
  { id: 'chores', label: 'Daily Chores', icon: '🧹' },
  { id: 'commercial', label: 'Commercial', icon: '📢' },
  { id: 'cps', label: 'CPS', icon: '🛡️' },
  { id: 'concert', label: 'Concert', icon: '🎵' },
  { id: 'weekly', label: 'Weekly', icon: '📅' },
  { id: 'classics', label: 'Classics', icon: '🎬' },
]

interface SidebarProps {
  activePanel: PanelId
  onNavigate: (id: PanelId) => void
}

export default function Sidebar({ activePanel, onNavigate }: SidebarProps) {
  return (
    <aside className="w-16 lg:w-56 shrink-0 bg-white/60 backdrop-blur-xl border-r border-midnight/5 flex flex-col transition-all duration-300">
      <div className="h-[60px] flex items-center justify-center lg:justify-start lg:px-5 border-b border-midnight/5">
        <span className="text-xl">🏙️</span>
        <span className="hidden lg:inline ml-2 font-extrabold text-base">
          <span className="text-midnight">City</span>
          <span className="text-copper">Work</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {panels.map((p) => {
          const isActive = activePanel === p.id
          return (
            <button
              key={p.id}
              onClick={() => onNavigate(p.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-copper/15 text-copper border-l-[3px] border-copper'
                  : 'text-slateblue hover:bg-copper/10 hover:text-copper'
              }`}
              title={p.label}
            >
              <span className="text-base w-6 text-center">{p.icon}</span>
              <span className="hidden lg:inline">{p.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-2 border-t border-midnight/5">
        <SignOutButton />
      </div>
    </aside>
  )
}

function SignOutButton() {
  return (
    <form action="/auth/signout" method="post" className="w-full">
      <button
        type="submit"
        className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 rounded-lg text-sm font-medium text-slateblue hover:bg-red-50 hover:text-red-600 transition"
      >
        <span className="text-base w-6 text-center">↪</span>
        <span className="hidden lg:inline">Sign Out</span>
      </button>
    </form>
  )
}