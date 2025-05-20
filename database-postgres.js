import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

export class DatabasePostgres {

  // TASKS

  async list(params, userEmail) {
    let tasks = ''
    let taskStatusFilter = null

    if (params.status === 'finished') {
      taskStatusFilter = true
    } else if (params.status === 'no-finished') {
      taskStatusFilter = false
    }

    if (params.name || taskStatusFilter !== null || params.group) {
      tasks = await sql`
      SELECT id, title, is_complete, task_group, user_email
      FROM tasks WHERE user_email = ${userEmail} AND ${
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
        SELECT id, is_complete 
        FROM tasks WHERE id = ${params}
      `
    } else {
      tasks = await sql`
        SELECT id, title, is_complete, task_group 
        FROM tasks WHERE user_email = ${userEmail}
      `
    }

    return tasks
  }

  async create(task, userEmail) {
    const id = randomUUID()

    await sql`
      INSERT INTO tasks (id, title, task_group, user_email) 
      VALUES (${id}, ${task.title}, ${task.task_group}, ${userEmail})`
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
    await sql`DELETE FROM tasks WHERE id = ${id}`
  }

  // USERS

  async createUser(user) {
    const userExists = await sql`
      SELECT display_name FROM users WHERE email = ${user.email}`
    
    if (!userExists) {
      await sql`
        INSERT INTO users (email, display_name)
        VALUES (${user.email}, ${user.name})`
    }
  }
}