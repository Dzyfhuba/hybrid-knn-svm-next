import supabase from "@/libraries/supabase"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const orderBy = url.searchParams.get("orderBy") || "id"
  const order = url.searchParams.get("order") || "asc"
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10)
  const current = parseInt(url.searchParams.get("current") || "0", 10)

  const data = await supabase
    .from("raw")
    .select("*")
    .order(orderBy, { ascending: order === "asc" })
    .range(current * pageSize, (current + 1) * pageSize - 1)

  const total = await supabase
    .from("raw")
    .select("id", { count: "exact" })

  return new Response(
    JSON.stringify({
      data: data.data,
      total: total.count,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (
      !body.pm10 || !body.pm2_5 || !body.so2 || !body.co ||
      !body.o3 || !body.no2 || !body.kualitas
    ) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi" }),
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("raw")
      .insert([body])

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
  } catch (err) {
    console.error("Internal Server Error (POST):", err)
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const url = request.nextUrl
  const id = url.searchParams.get("id")
  const body = await request.json()

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID is required for update" }),
      { status: 400 }
    )
  }

  if (
    !body.pm10 || !body.pm2_5 || !body.so2 || !body.co ||
    !body.o3 || !body.no2 || !body.kualitas
  ) {
    return new Response(
      JSON.stringify({ error: "Semua field wajib diisi" }),
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("raw")
    .update(body)
    .eq("id", id)

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )
}

export async function DELETE(request: NextRequest) {
  try {
    const url = request.nextUrl
    const id = url.searchParams.get("id")

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID is required for deletion" }),
        { status: 400 }
      )
    }

    console.log("Deleting data with ID:", id)

    const { data, error } = await supabase
      .from("raw")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Supabase Error (DELETE):", error.message)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ message: "Data deleted successfully", data }),
      {
        headers: { "content-type": "application/json" },
      }
    )
  } catch (err) {
    console.error("Internal Server Error (DELETE):", err)
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    )
  }
}
