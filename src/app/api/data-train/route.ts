import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest){
  const { searchParams } = new URL(request.url)
  
  const payload = z.object({
    reference: z.string(),
  }).safeParse(Object.fromEntries(searchParams.entries()))

  if (!payload.success) {
    return response.badRequest({ errors: payload.error.formErrors.fieldErrors })
  }

  const {data:model, error} = await supabase.from('model').select('id').eq('reference', payload.data.reference).single()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  const {data:data_train, error:error_data_train} = await supabase.from('data_train').select().eq('model_id', model.id)
  if (error_data_train) {
    return response.internalServerError({ message: error_data_train.message })
  }
  
  return response.success({ data: data_train })
}