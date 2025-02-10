import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest){
  // Mengambil parameter dari URL
  const url = request.nextUrl
  const querySchema = z.object({
    reference: z.string(),
  }).safeParse(Object.fromEntries(new URL(url).searchParams.entries()))

  if (!querySchema.success) {
    return response.badRequest({ errors: querySchema.error.formErrors.fieldErrors })
  }

  const reference = querySchema.data.reference

  // get model id
  const { data:model, error } = await supabase.from('model').select('id').eq('reference', reference).single()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  // Ambil data
  const { data, error:error2 } = await supabase
    .from('data_test')
    .select('*')
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

  return response.ok({data: data})
}