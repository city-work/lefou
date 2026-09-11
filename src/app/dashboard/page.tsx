import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './sign-out-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-mist p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-warmwhite rounded-2xl border border-midnight/5 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-midnight mb-2">
            Welcome to City Work 👋
          </h1>
          <p className="text-slateblue text-sm mb-6">
            Signed in as <span className="font-semibold text-midnight">{user.email}</span>
          </p>

          <div className="rounded-xl bg-mist/60 border border-midnight/5 p-4 mb-6">
            <p className="text-xs font-semibold text-slateblue uppercase tracking-wide mb-1">
              Auth status
            </p>
            <p className="text-sm text-midnight">
              ✅ You are authenticated. This page is protected by middleware.
            </p>
          </div>

          <SignOutButton />
        </div>
      </div>
    </main>
  )
}