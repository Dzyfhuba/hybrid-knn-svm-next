import { Database } from '@/types/database'
import { createClient } from '@supabase/supabase-js'

type Schema = 'svm_knn'

const URL = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_KEY
const SCHEMA: Schema = process.env.SUPABASE_SCHEMA as Schema || 'public'

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(URL, KEY, {db: {schema: SCHEMA}})

export default supabase