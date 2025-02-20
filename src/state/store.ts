import { Database } from '@/types/database'
import axios from 'axios'
import { action, Action, createStore, thunk, Thunk } from 'easy-peasy'

export interface GlobalState {
  model: Database['svm_knn']['Tables']['model']['Insert']
  putModel: Thunk<GlobalState, Database['svm_knn']['Tables']['model']['Insert']>
  setModel: Action<
    GlobalState,
    | ((model: GlobalState['model']) => GlobalState['model'])
    | GlobalState['model']
  >
  fetchModel: Thunk<GlobalState>
  predictionSvm: Database['svm_knn']['Tables']['prediction_svm']['Row'][]
  setPredictionSvm: Action<
    GlobalState,
    | ((model: GlobalState['predictionSvm']) => GlobalState['predictionSvm'])
    | GlobalState['predictionSvm']
  >
  session: { token: string | null; isLoading: boolean; email: string }
  setSession: Action<
    GlobalState,
    { token: string | null; isLoading: boolean; email: string }
  >
  deleteSession: Action<GlobalState>
  fetchSession: Thunk<GlobalState>
}

const store = createStore<GlobalState>({
  model: {},
  putModel: thunk(async (actions, payload) => {
    axios
      .put('/api/model', payload)
      .then(() => {
        actions.setModel(payload)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }),
  setModel: action((state, payload) => {
    state.model = typeof payload === 'function' ? payload(state.model) : payload
  }),
  fetchModel: thunk(async (actions) => {
    const { data } = await axios.get(
      '/api/model' +
        (typeof window !== 'undefined' &&
        window.localStorage.getItem('reference')
          ? `?reference=${window.localStorage.getItem('reference')}`
          : '')
    )
    if (data.item?.reference)
      localStorage.setItem('reference', data.item.reference)
    actions.setModel(data.item)
  }),
  predictionSvm: [],
  setPredictionSvm: action((state, payload) => {
    state.predictionSvm =
      typeof payload === 'function' ? payload(state.predictionSvm) : payload
  }),
  session: { token: null, isLoading: true, email: '' },
  setSession: action((state, payload) => {
    state.session = {
      token: payload.token,
      email: payload.email,
      isLoading: payload.isLoading,
    }
  }),
  deleteSession: action((state) => {
    localStorage.removeItem('session')
    state.session = { token: '', email: '', isLoading: false }
  }),
  fetchSession: thunk(async (actions) => {
    // const { data, error } = await supabase.auth.getSession()
    const data = JSON.parse(
      localStorage.getItem('session') ?? JSON.stringify('')
    )

    //check token expiration
    if (data && +new Date() > data.expires_at * 1000) {
      actions.deleteSession()
      return
    }

    if (data)
      actions.setSession({
        token: data.access_token,
        isLoading: false,
        email: data.user.email ?? '',
      })
    else actions.setSession({ token: null, isLoading: false, email: '' })
  }),
})

export default store
