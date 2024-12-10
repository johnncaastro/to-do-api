import { sql } from './db.js'

sql`
  CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    task_id TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
  );
`.then(() => {
  console.log('Tabela criada!')
})

// sql`
//   DROP TABLE IF EXISTS tasks;
// `.then(() => {
//   console.log('Tabela apagada!')
// })