import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const query = z.object({
    reference: z.string(),
  }).safeParse(Object.fromEntries(new URL(request.nextUrl).searchParams.entries()))

  if (!query.success) {
    return response.badRequest({ errors: query.error.formErrors.fieldErrors })
  }

  const {data:model, error} = await supabase.from('model').select('id').eq('reference', query.data.reference).single()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  const res = await supabase.from('data_train')
    .select('*')
    .eq('model_id', model.id)
  if (res.error) {
    return response.internalServerError({ message: res.error.message })
  }

  return response.ok({data: res.data})
}