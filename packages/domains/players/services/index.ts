import { Player, PlayerList } from '@/players'
import { Entity } from '@/shared'

export class PlayerService {
    /**
     * to store the list of players
     */
    private playersList = new PlayerList()

    /**
     * The function
     * @returns list of type players
     */
    public getPlayers = (): Promise<(Player & Entity)[]> => {
        return this.playersList.getAll()
    }

    public getOnePlayer = (id: number): Promise<Player> => {
        return this.playersList.getOne(id)
    }

    /**
     * This function adds an player to the player list
     * @param Player player
     * @returns Player
     */
    public addPlayer = (player: Player): Promise<number> => {
        return this.playersList.addOne(player)
    }

    /**
     * This function deletes an player
     * @param player Player
     */
    public deletePlayer = (id: number): Promise<void> => {
        return this.playersList.deleteOne(id)
    }

    /**
     * This function updates an player
     * @param oldPlayer Player
     * @param newPlayer Player
     */
    public updatePlayer = (id: number, player: Player): Promise<void> => {
        return this.playersList.updateOne(id, player)
    }
}
