import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const POST = async (request: NextRequest) => {
  const body = await request.json()

  const payload = z
    .object({
      email: z.string().email(),
      password: z.string(),
    })
    .safeParse(body)

  if (!payload.success) {
    return new Response(
      JSON.stringify({ errors: payload.error.formErrors.fieldErrors }),
      { status: 400 }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password,
  })

  if (error) {
    return new Response(JSON.stringify({ errors: error.message }), {
      status: error.status || 400,
    })
  }

  return new Response(JSON.stringify(data.session), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
