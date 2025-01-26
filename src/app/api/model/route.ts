import supabase from '@/libraries/supabase'
import { nanoid } from 'nanoid'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  let modelReference = searchParams.get('reference')

  if (!modelReference) {
    modelReference = nanoid()
  }

  const { data, error } = await supabase.from('model').select().eq('reference', modelReference)
  if (error || data.length === 0) {
    const { error: insertError } = await supabase.from('model').insert({ reference: modelReference })
    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
    }
  }

  return new Response(JSON.stringify({ reference: modelReference }), { status: 200 })
}