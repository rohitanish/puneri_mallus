import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // 1. Grab the destination from the URL or default to our success page
  const next = searchParams.get('redirect_to') || searchParams.get('next') || '/auth/verified'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  
  // Clean up params for a clean URL
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('next')
  redirectTo.searchParams.delete('redirect_to')

  if (token_hash && type) {
    // 🔥 FIX: Await the cookieStore
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // SUCCESS: User is verified, send them to /auth/verified
      return NextResponse.redirect(redirectTo)
    }
  }

  // ERROR: Fallback to login
  redirectTo.pathname = '/auth/login'
  return NextResponse.redirect(redirectTo)
}