import supabase from '@/config/supabase'
import Data from '@/types/data'
import axios from 'axios'
import { Action, Thunk, action, createStore, thunk } from 'easy-peasy'

export interface GlobalState {
  data: Data[]
  setData: Action<GlobalState, Data[]>
  getData: Thunk<GlobalState>
  updateData: Thunk<GlobalState, { data: Data, id: number }>
  deleteData: Thunk<GlobalState, { ids: number[] }>
  storeData: Thunk<GlobalState, Data>
  uploadData: Thunk<GlobalState, Data[]>

  isLoading: boolean
  setLoading: Action<GlobalState, boolean>
}
const store = createStore<GlobalState>({
  data: [],
  setData: action((state, payload) => {
    state.data = payload
  }),
  getData: thunk(async (actions) => {
    actions.setLoading(true)
    const { data } = await axios.get('http://localhost:3000/api/data')
    if (data) {
      actions.setData(data)
    }
    actions.setLoading(false)
    return data
  }),
  updateData: thunk(async (actions, payload) => {
    actions.setLoading(false)
    const {} = await supabase
      .from('dimas_data')
      .update(payload.data)
      .eq('id', payload.id!)
      .select()
    actions.setLoading(false)
  }),
  deleteData: thunk(async (actions, payload) => {
    actions.setLoading(false)
    const {} = await supabase
      .from('dimas_data')
      .delete()
      .eq('id', payload.ids)
      .select()
    actions.setLoading(false)
  }) ,
  storeData: thunk(async (actions, payload) => {
    actions.setLoading(false)
    const {} = await supabase
      .from('dimas_data')
      .insert({
        date: payload.date || '', 
        pm10: payload.pm10 || 0, 
        pm2_5: payload.pm2_5 || 0, 
        so2: payload.so2 || 0, 
        co: payload.co || 0, 
        o3: payload.o3 || 0, 
        no2: payload.no2 || 0, 
        location: payload.location || '' 
      })
      .select()
    actions.setLoading(false)
  }),
  uploadData: thunk(async (actions, payload) => {
    actions.setLoading(false)
    const { data, error } = await supabase
      .from('dimas_data')
      .insert( payload.map((item) => ({
        date: item.date || '', 
        pm10: item.pm10 || 0, 
        pm2_5: item.pm2_5 || 0, 
        so2: item.so2 || 0, 
        co: item.co || 0, 
        o3: item.o3 || 0, 
        no2: item.no2 || 0, 
        location: item.location || '' 
      })))
      .select()
    actions.setLoading(false)
  }),
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload
  }),
})

export default store