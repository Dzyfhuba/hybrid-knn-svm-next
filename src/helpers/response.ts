type Params<T extends object> = {
  data?: T[]
  item?: T
  errors?: Record<string, string[]>
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
  }
}

export default response