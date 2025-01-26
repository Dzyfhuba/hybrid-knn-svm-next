import { Database } from '@/types/database'
import axios from 'axios'
import { action, Action, createStore, thunk, Thunk } from 'easy-peasy'

export interface GlobalState {
  model: Database['svm_knn']['Tables']['model']['Row'][]
  putModel: Action<GlobalState, Database['svm_knn']['Tables']['model']['Row'][]>
  setModel: Action<GlobalState, Database['svm_knn']['Tables']['model']['Row'][]>
  fetchModel: Thunk<GlobalState, void>
}

const store = createStore<GlobalState>({
  model: [],
  putModel: action((state, payload) => {
    axios.put('/api/model', payload)
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }),
  setModel: action((state, payload) => {
    state.model = payload
  }),
  fetchModel: thunk(async (actions) => {
    const { data } = await axios.get('/api/model')
    actions.setModel(data)
  })
})

export default store