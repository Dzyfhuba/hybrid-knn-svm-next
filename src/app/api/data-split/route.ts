import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { Database } from '@/types/database'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function PUT(request: NextRequest) {
  const payload = z.object({
    train_length: z.number(),
    test_length: z.number(),
    reference: z.string()
  }).safeParse(await request.json())

  if (!payload.success) {
    return response.badRequest({errors: payload.error.formErrors.fieldErrors})
  }

  // Check if model exists
  const {data:model, error} = await supabase.from('model').select('id').eq('reference', payload.data?.reference).single()
  if (error) {
    return response.internalServerError({message: error.message})
  }

  // get all data
  const raw = await supabase.from('raw').select('pm10, pm2_5, so2, co, o3, no2, kualitas')
  if (raw.error) {
    return response.internalServerError({message: raw.error.message})
  }

  // count train length and test length
  const total = raw.data.length
  const train_length = Math.round(total * payload.data.train_length / 100)

  const rawNew:Database['svm_knn']['Tables']['data_train']['Insert'][] = []
  raw.data.forEach((item) => {
    rawNew.push({
      model_id: model.id,
      pm10: item.pm10,
      pm2_5: item.pm2_5,
      so2: item.so2,
      co: item.co,
      o3: item.o3,
      no2: item.no2,
      kualitas: item.kualitas,
    })
  })

  // slice data into train and test
  const train = rawNew.slice(0, train_length)
  const test = rawNew.slice(train_length)

  // delete all data from data_train and data_test
  const train_delete = await supabase.from('data_train').delete().eq('model_id', model.id)
  if (train_delete.error) {
    return response.internalServerError({message: train_delete.error.message})
  }
  const test_delete = await supabase.from('data_test').delete().eq('model_id', model.id)
  if (test_delete.error) {
    return response.internalServerError({message: test_delete.error.message})
  }
  
  // insert data into data_train and data_test
  const train_insert = await supabase.from('data_train').insert(train).select('*')
  if (train_insert.error) {
    return response.internalServerError({message: train_insert.error.message})
  }
  const test_insert = await supabase.from('data_test').insert(test).select('*')
  if (test_insert.error) {
    return response.internalServerError({message: test_insert.error.message})
  }
  console.log('train_length', payload.data.train_length)
  // save train length
  const model_update = await supabase.from('model')
    .update({
      train_percentage: payload.data.train_length,
    })
    .eq('id', model.id)
  if (model_update.error) {
    return response.internalServerError({message: model_update.error.message})
  }

  const modelItem = await supabase.from('model').select('*').eq('id', model.id).single()
  if (modelItem.error) {
    return response.internalServerError({message: modelItem.error.message})
  }

  return response.created({
    extra: {
      data_train: train_insert.data,
      data_test: test_insert.data,
      model: modelItem.data,
    },
    message: 'Data berhasil di-split',
  })
}