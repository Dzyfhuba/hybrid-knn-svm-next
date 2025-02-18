import supabase from '@/libraries/supabase'
import ISPU from '@/models/ispu'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  // Mengambil parameter dari URL
  const url = request.nextUrl
  const orderBy = url.searchParams.get('orderBy') || 'id'  // Default berdasarkan 'id'
  const order = url.searchParams.get('order') || 'asc'     // Default urutan 'asc'
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)  // Ukuran halaman
  const current = parseInt(url.searchParams.get('current') || '1', 10)  // Halaman saat ini (dimulai dari 1)

  try {
    // Ambil data dengan urutan dan paginasi
    const { data, error } = await supabase
      .from('raw')
      .select('*')
      .order(orderBy, { ascending: order === 'asc' })  
      .range((current - 1) * pageSize, current * pageSize - 1)

    if (error) throw error

    const { count, error: countError } = await supabase
      .from('raw')
      .select('id', { count: 'exact' })

    if (countError) throw countError

    return new Response(
      JSON.stringify({
        data: data,
        total: count,
      }, null, 0),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } catch (error) {
    // Jika ada error, kembalikan response error
    console.error(error)
    return new Response(
      JSON.stringify({
        error: 'Terjadi kesalahan dalam mengambil data',
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
}


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
    
    const payload = z.object({
      pm10: z.number().positive(),
      pm2_5: z.number().positive(),
      so2: z.number().positive(),
      co: z.number().positive(),
      o3: z.number().positive(),
      no2: z.number().positive(),
    }).safeParse(body)

    if (!payload.success) {
      return new Response(
        JSON.stringify({ errors: payload.error.formErrors.fieldErrors }),
        { status: 400 }
      )
    }

    console.log('Inserting data:', ISPU.calculateSummaryWithLabel(payload.data))
    body['kualitas'] = ISPU.calculateSummaryWithLabel(payload.data)

    const { data, error } = await supabase
      .from('raw')
      .insert([body])

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } catch (err) {
    console.error('Internal Server Error (POST):', err)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const AuthToken = request.headers.get('Authorization') ?? ''
  const {error: authError} = await supabase.auth.getUser(AuthToken)
  if (authError) {
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

  const url = request.nextUrl
  const id = parseInt(url.searchParams.get('id') || '0')
  const body = await request.json()

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID is required for update' }),
      { status: 400 }
    )
  }
  
  const payload = z.object({
    pm10: z.number().positive(),
    pm2_5: z.number().positive(),
    so2: z.number().positive(),
    co: z.number().positive(),
    o3: z.number().positive(),
    no2: z.number().positive(),
  }).safeParse(body)

  if (!payload.success) {
    return new Response(
      JSON.stringify({ errors: payload.error.formErrors.fieldErrors }),
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('raw')
    .update(body)
    .eq('id', id)

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  )
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
    const url = request.nextUrl
    const id = parseInt(url.searchParams.get('id') || '0')

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID is required for deletion' }),
        { status: 400 }
      )
    }

    console.log('Deleting data with ID:', id)

    const { data, error } = await supabase
      .from('raw')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase Error (DELETE):', error.message)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Data deleted successfully', data }),
      {
        headers: { 'content-type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Internal Server Error (DELETE):', err)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
