import supabase from '@/libraries/supabase'
// import ISPU from '@/models/ispu'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  const AuthToken = request.headers.get('Authorization') ?? ''
  const {error} = await supabase.auth.getUser(AuthToken)
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

  try {
    const body = await request.json()

    const dataRawArray = z.object({
      pm10: z.number().positive(),
      pm2_5: z.number().positive(),
      so2: z.number().positive(),
      co: z.number().positive(),
      o3: z.number().positive(),
      no2: z.number().positive(),
      kualitas: z.string(),
    })

    const payload = z.array(dataRawArray).safeParse(body)

    if (!payload.success) {
      return new Response(
        JSON.stringify({ errors: payload.error.formErrors.fieldErrors }),
        { status: 400 }
      )
    }

    const { count, error: countError } = await supabase
      .from('raw')
      .select('id', { count: 'exact' })

    if (countError) {
      return new Response(JSON.stringify({ error: countError.message }), {
        status: 400,
      })
    }

    if ((count ?? 0) + payload.data.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'The amount of data exceeds capacity' }),
        {
          status: 400,
        }
      )
    }

    // console.log('Inserting data:', ISPU.calculateSummaryWithLabel(payload.data))
    // body['kualitas'] = ISPU.calculateSummaryWithLabel(payload.data)

    const { data, error } = await supabase.from('raw').insert(payload.data)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json',
      },
    })
  } catch (err) {
    console.error('Internal Server Error (POST):', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

export async function DELETE(request: NextRequest) {
  const AuthToken = request.headers.get('Authorization') ?? ''
  const {error} = await supabase.auth.getUser(AuthToken)
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
  
  try {
    const body = await request.json()

    const payload = z.number().array().safeParse(body)

    if (!payload.success) {
      return new Response(
        JSON.stringify({ errors: payload.error.formErrors.fieldErrors }),
        { status: 400 }
      )
    }

    // console.log('Deleting data with ID:', id)

    const { data, error } = await supabase
      .from('raw')
      .delete()
      .in('id', payload.data)

    if (error) {
      console.error('Supabase Error (DELETE):', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }

    return new Response(
      JSON.stringify({ message: 'Data deleted successfully', data }),
      {
        headers: { 'content-type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Internal Server Error (DELETE):', err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
