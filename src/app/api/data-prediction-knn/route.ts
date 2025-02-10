import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  // Mengambil parameter dari URL
  const url = request.nextUrl
  const querySchema = z
    .object({
      orderBy: z.string().optional().default('id'),
      order: z.enum(['asc', 'desc']).optional().default('asc'),
      pageSize: z
        .string()
        .transform((val) => parseInt(val, 10))
        .optional()
        .default('10'),
      current: z
        .string()
        .transform((val) => parseInt(val, 10))
        .optional()
        .default('1'),
      reference: z.string(),
    })
    .safeParse(Object.fromEntries(new URL(url).searchParams.entries()))

  if (!querySchema.success) {
    return response.badRequest({
      errors: querySchema.error.formErrors.fieldErrors,
    })
  }

  const orderBy = querySchema.data.orderBy
  const order = querySchema.data.order
  const pageSize = querySchema.data.pageSize
  const current = querySchema.data.current
  const reference = querySchema.data.reference

  // get model id
  const { data: model, error } = await supabase
    .from('model')
    .select('id')
    .eq('reference', reference)
    .single()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  // Ambil data dengan urutan dan paginasi
  const { data, error: error2 } = await supabase
    .from('prediction_knn')
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
    .from('prediction_knn')
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
    JSON.stringify(
      {
        data: data,
        total: count,
      },
      null,
      0
    ),
    {
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}

export async function PUT(request: NextRequest) {
  const dataPredictionKnnSchema = z.object({
    co: z.number(),
    created_at: z.string(),
    id: z.number(),
    actual: z.string(),
    prediction: z.string(),
    no2: z.number(),
    o3: z.number(),
    pm10: z.number(),
    pm2_5: z.number(),
    so2: z.number(),
    model_id: z.number(),
  })

  const payload = z
    .object({
      data: z.array(dataPredictionKnnSchema),
      reference: z.string(),
    })
    .safeParse(await request.json())

  if (!payload.success) {
    return response.badRequest({
      errors: payload.error.formErrors.fieldErrors,
    })
  }

  // get model id
  const { data: model, error } = await supabase
    .from('model')
    .select('id')
    .eq('reference', payload.data?.reference)
    .single()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  // remove data where model_id
  const del = await supabase
    .from('prediction_knn')
    .delete()
    .eq('model_id', model.id)
  if (del.error) {
    return response.internalServerError({ message: del.error.message })
  }

  //insert datas
  const res = await supabase.from('prediction_knn').insert(payload.data?.data)

  if (res.error) {
    return response.internalServerError({ message: res.error.message })
  }

  return response.ok({})
}
