import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest){
  // Mengambil parameter dari URL
  const url = request.nextUrl
  const querySchema = z.object({
    orderBy: z.string().optional().default('id'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
    pageSize: z.string().transform((val) => parseInt(val, 10)).optional().default('10'),
    current: z.string().transform((val) => parseInt(val, 10)).optional().default('1'),
    reference: z.string(),
  }).safeParse(Object.fromEntries(new URL(url).searchParams.entries()))

  if (!querySchema.success) {
    return response.badRequest({ errors: querySchema.error.formErrors.fieldErrors })
  }

  const orderBy = querySchema.data.orderBy
  const order = querySchema.data.order
  const pageSize = querySchema.data.pageSize
  const current = querySchema.data.current
  const reference = querySchema.data.reference

  // get model id
  const { data:model, error } = await supabase.from('model').select('id').eq('reference', reference).single()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  // Ambil data dengan urutan dan paginasi
  const { data, error:error2 } = await supabase
    .from('data_train')
    .select('*')
    .order(orderBy, { ascending: order === 'asc' })  
    .range((current - 1) * pageSize, current * pageSize - 1)
    .eq('model_id', model.id)
  if (error2) {
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

  const { count, error: countError } = await supabase
    .from('data_train')
    .select('id', { count: 'exact' })
    .eq('model_id', model.id)

  if (countError) {
    console.error(countError)
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
}