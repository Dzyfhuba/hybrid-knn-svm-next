import Data from '@/types/data'
import Dexie, { type EntityTable } from 'dexie'

const db = new Dexie('KNN_SVM') as Dexie & {
  dataRaw: EntityTable<
    Data,
    'id' // primary key "id" (for the typings only)
  >,
  dataClean: EntityTable<
  Data,
  'id' // primary key "id" (for the typings only)
>,
}

db.version(process.env.NEXT_PUBLIC_IDB_VERSION).stores({
  dataRaw: 'id', // primary key "id" (for the runtime!)
  dataClean: 'id' // primary key "id" (for the runtime!)
})


export default db 