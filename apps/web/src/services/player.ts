import { Player } from 'domains'

const ENDPOINT = 'http://localhost:3001/api/players'

export const getPlayers = async () => {
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

export const getPlayer = async (id: number) => {
    const response = await fetch(`${ENDPOINT}/${id}`, {
        method: 'GET',
    })
    const player = await response.json()
    return player
}

export const addPlayer = async (player: Player) => {
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(player),
        })
        if (response.status == 400) {
            const errorResponse = await response.json()
            throw new Error(errorResponse.message)
        }
    } catch (error) {
        throw error
    }
}

export const deletePlayer = async (id: number) => {
    const response = await fetch(`${ENDPOINT}/${id}`, {
        method: 'DELETE',
    })
}

export const updatePlayer = async (id: number, player: Player) => {
    const response = await fetch(`${ENDPOINT}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(player),
    })
}
