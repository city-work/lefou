'use client'

import { PanelId } from './DashboardShell'

export default function PanelContent({
  panel,
  userEmail,
}: {
  panel: PanelId
  userEmail: string
}) {
  if (panel === 'dashboard') {
    return (
      <div>
        <div className="bg-warmwhite rounded-2xl border border-midnight/5 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-midnight mb-1">Welcome back 👋</h2>
          <p className="text-sm text-slateblue">
            Signed in as <span className="font-semibold text-midnight">{userEmail}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { icon: '📋', label: 'Masterlist' },
            { icon: '🧹', label: 'Daily Chores' },
            { icon: '📢', label: 'Commercial' },
            { icon: '🛡️', label: 'CPS' },
            { icon: '🎵', label: 'Concert' },
            { icon: '📅', label: 'Weekly' },
            { icon: '🎬', label: 'Classics' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-warmwhite p-4 rounded-2xl border border-mist/50 text-center hover:border-copper transition-all hover:shadow-md cursor-pointer"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-semibold text-midnight">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-16 bg-warmwhite rounded-2xl border border-dashed border-midnight/10 max-w-md mx-auto">
      <p className="text-3xl mb-2">🚧</p>
      <h3 className="text-base font-semibold text-midnight capitalize">
        {panel.replace('_', ' ')}
      </h3>
      <p className="text-xs text-slateblue mt-1">
        This panel is coming soon.
      </p>
    </div>
  )
}