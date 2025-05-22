import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { DatabasePostgres } from './database-postgres.js'

const database = new DatabasePostgres()

const server = fastify()

server.register(cors, {
  origin: ['http://localhost:3334', 'https://to-do-iota-five.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
})

// TASKS ROUTES

server.get('/tasks/:email', async (request, reply) => {
  const params = request.query
  const userEmail = request.params.email

  const tasks = await database.list(params, userEmail)

  return tasks
})

server.post('/tasks', async (request, reply) => {
  const { title, task_group, userEmail } = request.body

  await database.create({ title, task_group }, userEmail)

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

// USERS ROUTES

server.post('/users/sign-in', async (request, reply) => {
  const { displayName, email } = request.body

  const user = {
    name: displayName,
    email
  }

  await database.createUser(user)

  reply.status(201).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333
})
