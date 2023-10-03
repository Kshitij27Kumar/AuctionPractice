import { Entity, Player, PlayerService } from 'domains'
import express, { Request, Response } from 'express'

const app = express()
const PORT = 3001

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
    const player: Player & Entity = await playerService.getOnePlayer(Number(id))

    if (Number(id) === player.id) {
        response.status(200).json(player)
        return
    }

    response.status(404).json({})
})

let idCounter = 0
app.post('/players', (request: Request, response: Response) => {
    const player = {
        id: ++idCounter,
        ...request.body,
    }
    response.status(201).json(player)
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})
