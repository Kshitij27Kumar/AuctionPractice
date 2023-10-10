import { PlayerRepository } from './../shared/player-repository'
import { Entity, Player } from 'domains'
import express, { Request, Response } from 'express'
import Database from '../shared/database'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

const playerService = new PlayerRepository(Database.getInstance())

app.get('/', (request: Request, response: Response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/players', async (request: Request, response: Response) => {
    const players = await playerService.getAll()
    response.status(200).json(players)
})

app.get('/players/:id', async (request: Request, response: Response) => {
    const { id } = request.params

    try {
        const player: Player & Entity = await playerService.getOne(Number(id))
        response.status(200).json(player)
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.post('/players', async (request: Request, response: Response) => {
    try {
        const player = await playerService.addOne(request.body)
        response.status(201).json(player)
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.delete('/players/:id', async (request: Request, response: Response) => {
    try {
        const playerId = Number(request.params.id)
        await playerService.deleteOne(playerId)
        response.status(204).send()
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.patch('/players/:id', async (request: Request, response: Response) => {
    try {
        const playerId = Number(request.params.id)
        const oldPlayer = await playerService.getOne(playerId)
        await playerService.updateOne(playerId, {
            ...oldPlayer,
            ...request.body,
        })
        response.status(200).send()
    } catch (error) {
        response.status(404).json({ error })
    }
})

const run = async () => {
    try {
        const db = Database.getInstance()
        await db.connect()

        app.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`)
        })
    } catch (error) {
        console.error('Could not connect to database')
    }
}

run()
