import { Entity, Player, PlayerService } from 'domains'
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())

const playerService = new PlayerService()

app.get('/', (request: Request, response: Response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/players', async (request: Request, response: Response) => {
    const players = await playerService.getPlayers()
    response.status(200).json(players)
})

app.get('/players/:id', async (request: Request, response: Response) => {
    const { id } = request.params

    try {
        const player: Player & Entity = await playerService.getOnePlayer(
            Number(id)
        )
        response.status(200).json(player)
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.post('/players', async (request: Request, response: Response) => {
    try {
        const playerId = await playerService.addPlayer(request.body)
        const player = await playerService.getOnePlayer(playerId)
        response.status(201).json(player)
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.delete('/players/:id', async (request: Request, response: Response) => {
    try {
        const playerId = Number(request.params.id)
        await playerService.deletePlayer(playerId)
        response.status(204).send()
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.patch('/players/:id', async (request: Request, response: Response) => {
    try {
        const playerId = Number(request.params.id)
        const oldPlayer = await playerService.getOnePlayer(playerId)
        await playerService.updatePlayer(playerId, {
            ...oldPlayer,
            ...request.body,
        })
        response.status(200).send()
    } catch (error) {
        response.status(404).json({ error })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})
