import supabase from '@/libraries/supabase'

export const GET = async () => {
  try {
    // Ambil data dengan urutan dan paginasi
    const { data, error } = await supabase.from('raw').select('id')

    if (error) throw error

    return new Response(
      JSON.stringify({
        data: data,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } catch (error) {
    // Jika ada error, kembalikan response error
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
}
