import { randomUUID } from 'node:crypto'

export class DatabaseMemory {
  #tasks = new Map()

  list(search) {
    return Array.from(this.#tasks.entries()).map(taskArray => {
      const id = taskArray[0]
      const task = taskArray[1]

      return {
        id,
        ...task
      }
    }).filter(task => {
      if(search) {
        return task.title.includes(search)
      }

      return true
    })
  }

  create(task) {
    const id = randomUUID()

    this.#tasks.set(id, task)
  }

  update(id, task) {
    this.#tasks.set(id, task)
  }

  delete(id) {
    this.#tasks.delete(id)
  }
}

// UUID - UNIVERSAL UNIQUE ID