import { NextRequest, NextResponse } from 'next/server'
import  axios from 'axios'
import supabase from '@/config/supabase'

export async function GET(request : NextRequest){
  const { data, error } = await supabase
    .from('dimas_data')
    .select('*')
    .is('deleted_at', null)

  return NextResponse.json(data)
}