import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { DatabasePostgres } from './database-postgres.js'

const database = new DatabasePostgres()

const server = fastify()

server.register(cors, {
  origin: ['http://localhost:3334', 'https://to-do-iota-five.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})

server.get('/tasks', async (request, reply) => {
  const search = request.query.search

  const tasks = await database.list(search)

  return tasks
})

server.post('/tasks', async (request, reply) => {
  const { title, task_group } = request.body

  await database.create({ title, task_group })

  reply.status(201).send()
})

server.put('/tasks/:id', async (request, reply) => {
  const id = request.params.id
  const { title, task_group } = request.body

  const taskExists = await database.list(id)

  if (taskExists.length === 0) {
    reply.status(404).send()

    return
  }

  await database.update(id, { title, task_group })

  reply.status(204).send()
})

server.patch('/tasks/:id/completed', async (request, reply) => {
  const id = request.params.id

  const taskExists = await database.list(id)

  if (taskExists.length === 0) {
    reply.status(404).send()

    return
  }

  await database.updateIsCompletedTask(taskExists)

  reply.status(204).send()
})

server.delete('/tasks/:id', async (request, reply) => {
  const id = request.params.id

  const taskExists = await database.list(id)

  if (taskExists.length === 0) {
    reply.status(404).send()

    return
  }

  await database.delete(id)

  reply.status(204).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333
})
