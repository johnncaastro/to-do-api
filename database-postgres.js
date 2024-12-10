import { randomUUID } from 'node:crypto'
import { sql } from './db.js'

export class DatabasePostgres {

  async list(search) {
    let tasks = ''
    
    if(search) {
      tasks = await sql`select * from tasks where title ilike ${'%' + search + '%'}`
    } else {
      tasks = await sql`select * from tasks`
    }

    const tasksItems = await sql`select * from items`

    const tasksWithItems = tasks.map(task => {
      return {
        ...task,
        items: tasksItems.filter(item => item.task_id === task.id)
      }
    })

    return tasksWithItems
  }

  async create(task) {
    const id = randomUUID()

    await sql`insert into tasks (id, title) VALUES (${id}, ${task.title})`

    task.items.map(async (item) => {
      return await sql`insert into items (name, task_id) VALUES (${item.name}, ${id})`
    })
  }

  async update(taskId, task) {
    await sql`update tasks set title = ${task.title} WHERE id = ${taskId}`

    task.items.map(async (item) => {
      return await sql`update items set name = ${item.name} WHERE id = ${item.id}`
    })
  }

  async updateCompletedItems(itemId) {
    const tasksItems = await sql`select * from items`

    const currentItem = tasksItems.filter(item => item.id === itemId)

    await sql`update items set is_complete = ${!currentItem[0].is_complete} WHERE id = ${itemId}`
  }

  async delete(id) {
    await sql`delete from tasks where id = ${id}`
  }
}