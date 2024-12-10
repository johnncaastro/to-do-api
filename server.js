import { fastify } from 'fastify'
import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

const server = fastify()

server.get('/tasks', async (request, reply) => {
  const search = request.query.search

  const tasks = await database.list(search)

  return tasks
})

server.post('/tasks', async (request, reply) => {
  const { title, items } = request.body

  await database.create({ title, items })

  reply.status(201).send()
})

server.put('/tasks/:id', async (request, reply) => {
  const id = request.params.id
  const { title, items } = request.body

  await database.update(id, { title, items })

  reply.status(204).send()
})

server.put('/tasks/item/completed/:id', async (request, reply) => {
  const id = Number(request.params.id)

  await database.updateCompletedItems(id)

  reply.status(204).send()
})

server.delete('/tasks/:id', async (request, reply) => {
  const id = request.params.id

  await database.delete(id)

  reply.status(204).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333
})

// GET, POST, PUT, PATCH, DELETE

// GET - OBTER DADOS
// POST - CRIAR DADOS
// PUT - ATUALIZAR TODO O DADO
// PATCH - ATUALIZAR UMA INFORMAÇÃO REFERENTE AO DADO
// DELETE - REMOVER DADOS

// CRUD - CREATE, READ, UPDATE E DELETE

// request body, route parameter, query params/search params