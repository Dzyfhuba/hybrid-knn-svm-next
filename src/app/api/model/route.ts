import response from '@/helpers/response'
import supabase from '@/libraries/supabase'
import { nanoid } from 'nanoid'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  let modelReference = searchParams.get('reference')

  if (!modelReference || modelReference == 'null') {
    modelReference = nanoid()
  }

  const { data, error } = await supabase.from('model').select().eq('reference', modelReference).maybeSingle()
  if (error) {
    return response.internalServerError({ message: error.message })
  }

  if (!data) {
    const { error: insertError } = await supabase.from('model').insert({ reference: modelReference })
    if (insertError) {
      return response.internalServerError({ message: insertError.message })
    }
  }


  return response.ok({
    // item: {
    //   reference: modelReference,
    //   train_percentage: data?.train_percentage || 80
    // }
    item: {
      ...data,
      reference: modelReference,
    }
  })
}

export async function PUT(request: NextRequest) {
  const payload = z.object({
    train_percentage: z.number(),
    reference: z.string(),
    svm_report: z.any().optional(),
    knn_report: z.any().optional(),
    model: z.any().optional()
  }).safeParse({
    ...await request.json(),
    ...(new URL(request.url).searchParams)
  })

  if (!payload.success) {
    return new Response(JSON.stringify({ error: payload.error }), { status: 400 })
  }

  // put train_percentage to model
  const { error: modelError } = await supabase.from('model')
    .update({
      train_percentage: payload.data.train_percentage,
      svm_report: payload.data.svm_report,
      knn_report: payload.data.knn_report,
      model: payload.data.model
    })
    .eq('reference', payload.data.reference)
  if (modelError) {
    return new Response(JSON.stringify({ error: modelError.message }), { status: 500 })
  }

  return response.ok({ message: 'Data berhasil disimpan' })
}