import supabase from '@/libraries/supabase'
// import ISPU from '@/models/ispu'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
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
