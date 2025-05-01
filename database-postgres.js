import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

export class DatabasePostgres {

  async list(params) {
    let tasks = ''
    let taskStatusFilter = null

    if (params.status === 'finished') {
      taskStatusFilter = true
    } else if (params.status === 'no-finished') {
      taskStatusFilter = false
    }

    if (Object.keys(params).length !== 0) {
      tasks = await sql`
      SELECT id, title, is_complete, task_group 
      FROM tasks WHERE ${
        params.name
          ? sql`title ILIKE ${'%' + params.name + '%'}`
          : sql`title ILIKE ${'%'}`
      } AND ${
        taskStatusFilter !== null
          ? sql`is_complete = ${taskStatusFilter}`
          : sql`is_complete IN (${true}, ${false})`
      } AND ${
        params.group
          ? sql`task_group = ${params.group}`
          : sql`task_group ILIKE ${'%'}`
      }
    `
    } else if (typeof params === 'string') {
      tasks = await sql`
        SELECT id, title, is_complete, task_group 
        FROM tasks WHERE id = ${params}
      `
    } else {
      tasks = await sql`
        SELECT id, title, is_complete, task_group 
        FROM tasks
      `
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