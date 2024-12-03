import supabase from "@/libraries/supabase"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const orderBy = url.searchParams.get("orderBy") || "id"
  const order = url.searchParams.get("order") || "asc"
  const limit = url.searchParams.get("limit") || 10
  const offset = url.searchParams.get("offset") || 0

  const data = await supabase.from("raw").select("*")
    .order(orderBy, {ascending: order === "asc"})
    .range(Number(offset), Number(offset) + Number(limit))
    

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  })
}