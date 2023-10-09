import { Entity, ObjectId, Player } from 'domains'

const ENDPOINT = 'http://localhost:3001/api/players'

export interface AddPlayerService {
    addPlayer(player: Player): Promise<Player & Entity>
}

export interface UpdatePlayerService {
    updatePlayer(id: ObjectId, player: Player): Promise<Player & Entity>
}

export interface GetAllPlayersService {
    getPlayers(): Promise<(Player & Entity)[]>
}

export interface DeletePlayerService {
    deletePlayer(id: ObjectId): Promise<void>
}

export interface GetOnePlayerService {
    getPlayer(id: ObjectId): Promise<Player & Entity>
}

export class PlayerService
    implements
        GetAllPlayersService,
        GetOnePlayerService,
        AddPlayerService,
        UpdatePlayerService,
        DeletePlayerService
{
    public getPlayers = async (): Promise<(Player & Entity)[]> => {
        try {
            const response = await fetch(ENDPOINT, {
                method: 'GET',
            })
            const players = await response.json()

            return players
        } catch (error) {
            throw error
        }
    }

    public getPlayer = async (id: ObjectId): Promise<Player & Entity> => {
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'GET',
        })
        const player = await response.json()
        return player
    }

    public addPlayer = async (player: Player): Promise<Player & Entity> => {
        try {
            const response = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(player),
            })
            const json = await response.json()

            if (response.status == 400) {
                const errorResponse = json
                throw new Error(errorResponse.message)
            }

            return json
        } catch (error) {
            throw error
        }
    }

    public deletePlayer = async (id: number): Promise<void> => {
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
        })
    }

    public updatePlayer = async (
        id: number,
        player: Player
    ): Promise<Player & Entity> => {
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player),
        })
        const updatedPlayer = await response.json()
        return updatedPlayer
    }
}
