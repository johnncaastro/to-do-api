import { sql } from './db.js'

sql`
  ALTER TABLE tasks
  ADD is_complete BOOLEAN DEFAULT false,
  ADD task_group TEXT;
`.then(() => {
  console.log('Tabela alterada!')
})
