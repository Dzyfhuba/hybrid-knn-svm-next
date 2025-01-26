import { Database } from '@/types/database'
import axios from 'axios'
import { action, Action, createStore, thunk, Thunk } from 'easy-peasy'

export interface GlobalState {
  model: Database['svm_knn']['Tables']['model']['Insert']
  putModel: Action<GlobalState, Database['svm_knn']['Tables']['model']['Row']>
  setModel: Action<GlobalState, ((model: GlobalState['model']) => GlobalState['model']) | GlobalState['model']>
  fetchModel: Thunk<GlobalState, void>
}

const store = createStore<GlobalState>({
  model: {},
  putModel: action((state, payload) => {
    axios.put('/api/model', payload)
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }),
  setModel: action((state, payload) => {
    state.model = typeof payload === 'function' ? payload(state.model) : payload
  }),
  fetchModel: thunk(async (actions) => {
    const { data } = await axios.get('/api/model' + (typeof window !== 'undefined' ? `?reference=${window.localStorage.getItem('reference')}` : ''))
    actions.setModel(data.item)
  })
})

export default store