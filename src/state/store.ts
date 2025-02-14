import { Database } from '@/types/database'
import axios from 'axios'
import { action, Action, createStore, thunk, Thunk } from 'easy-peasy'

export interface GlobalState {
  model: Database['svm_knn']['Tables']['model']['Insert']
  putModel: Thunk<GlobalState, Database['svm_knn']['Tables']['model']['Insert']>
  setModel: Action<GlobalState, ((model: GlobalState['model']) => GlobalState['model']) | GlobalState['model']>
  fetchModel: Thunk<GlobalState>
  predictionSvm : Database['svm_knn']['Tables']['prediction_svm']['Row'][]
  setPredictionSvm : Action<GlobalState, ((model: GlobalState['predictionSvm']) => GlobalState['predictionSvm']) | GlobalState['predictionSvm']>
}

const store = createStore<GlobalState>({
  model: {},
  putModel: thunk(async (actions, payload) => {
    axios.put('/api/model', payload)
      .then(()=>{
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
    const { data } = await axios.get('/api/model' + ((typeof window !== 'undefined' && window.localStorage.getItem('reference')) ? `?reference=${window.localStorage.getItem('reference')}` : ''))
    if(data.item?.reference) localStorage.setItem('reference', data.item.reference)
    actions.setModel(data.item)
  }),
  predictionSvm : [],
  setPredictionSvm : action((state, payload) => {
    state.predictionSvm = typeof payload === 'function' ? payload(state.predictionSvm) : payload
  }),
})

export default store