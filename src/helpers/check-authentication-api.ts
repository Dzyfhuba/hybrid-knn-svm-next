import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'

const checkAuthenticationApi = async (request: NextRequest) => {
  const AuthToken = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(AuthToken)

  if (error) {
    return new Response(
      JSON.stringify({
        message: 'Not Authenticated',
      }),
      {
        status: 401,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
}

export default checkAuthenticationApi
