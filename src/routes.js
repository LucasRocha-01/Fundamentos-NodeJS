import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handle: (req, res) => {
            const { search } = req.query

            const searchData = search ? {
                title: search,
                description: search,
            } : null;

            const tasks = database.select('tasks', searchData)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handle: (req, res) => {
            const { title, description } = req.body
            const task = {
                id: randomUUID(),

                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handle: (req, res) => {
            const { id } = req.params
            const { title, description, completed_at, created_at } = req.body

            database.update('tasks', id, {
                title,
                description,
                completed_at,
                created_at,
                updated_at: new Date()
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handle: (req, res) => {
            const { id } = req.params

            database.done('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handle: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    }
]