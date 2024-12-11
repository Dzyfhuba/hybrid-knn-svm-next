import supabase from "@/libraries/supabase"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const orderBy = url.searchParams.get("orderBy") || "id"
  const order = url.searchParams.get("order") || "asc"
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10)
  const current = parseInt(url.searchParams.get("current") || "0", 10)

  const data = await supabase.from("raw").select("*")
    .order(orderBy, {ascending: order === "asc"})
    .range(current * pageSize, (current + 1) * pageSize - 1)
    
  const total = await supabase.from("raw").select("id", {count: "exact"})

  return new Response(JSON.stringify({
    data: data.data,
    total: total.count,
  }), {
    headers: {
      "content-type": "application/json",
    },
  })
}

export async function PUT(request: NextRequest) {
  const url = request.nextUrl
  const id = url.searchParams.get("id")  
  const body = await request.json()  


  if (!id) {
    const { data, error } = await supabase
      .from("raw")
      .insert([body])  
      .select() 

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
      },
    })
  }


  const { data, error } = await supabase
    .from("raw")
    // .upsert([{ id: id, ...body }], { onConflict: "id" })  
    .upsert([ body ], { onConflict: "id" })  

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  })
}