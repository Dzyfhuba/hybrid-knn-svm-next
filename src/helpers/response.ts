type Params<T extends object> = {
  data?: T[]
  item?: T
  extra?: unknown
  errors?: Record<string, string[]>
  message?: string
}

const response = {
  success: <T extends object>(params: Params<T>) => {
    return new Response(
      JSON.stringify(params, null, 0),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  },
  ok: <T extends object>(params: Params<T>) => {
    return new Response(
      JSON.stringify(params, null, 0),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  },
  created: <T extends object>(params: Params<T>) => {
    return new Response(
      JSON.stringify(params, null, 0),
      {
        status: 201,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  },
  badRequest: <T extends object>(params: Params<T>) => {
    return new Response(
      JSON.stringify(params, null, 0),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  },
  internalServerError: <T extends object>(params: Params<T>) => {
    return new Response(
      JSON.stringify(params, null, 0),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
}

export default response