import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

export class DatabasePostgres {

  async list(search) {
    let tasks = ''
    
    if(search) {
      tasks = await sql`
        SELECT id, title, is_complete, task_group 
        FROM tasks WHERE title ILIKE ${'%' + search + '%'} OR id = ${search}
      `
    } else {
      tasks = await sql`SELECT id, title, is_complete, task_group FROM tasks`
    }

    return tasks
  }

  async create(task) {
    const id = randomUUID()

    await sql`
      INSERT INTO tasks (id, title, task_group) 
      VALUES (${id}, ${task.title}, ${task.task_group})`
  }

  async update(taskId, task) {
    await sql`
      UPDATE tasks SET title = ${task.title}, task_group = ${task.task_group} 
      WHERE id = ${taskId}
    `
  }

  async updateIsCompletedTask(task) {
    const [{ id, is_complete }] = task

    await sql`UPDATE tasks SET is_complete = ${!is_complete} WHERE id = ${id}`
  }

  async delete(id) {
    await sql`delete from tasks where id = ${id}`
  }
}