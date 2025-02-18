import supabase from '@/libraries/supabase'

export const fetchWithToken = async ({
  url,
  method = 'GET',
  body,
  headers = {},
}: {
  url: string
  method?: 'GET' | 'POST' | ' PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: BodyInit
}) => {
  const { data } = await supabase.auth.getSession()

  const response = await fetch(url, {
    method: method,
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: data?.session?.access_token ?? '',
      ...headers,
    },
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      message: responseData?.message || 'An error occurred',
    }
  }

  return responseData
}
