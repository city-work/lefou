'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-5 py-2.5 rounded-full bg-copper hover:bg-copperhover text-white font-semibold text-sm shadow-md transition"
    >
      Sign Out
    </button>
  )
}