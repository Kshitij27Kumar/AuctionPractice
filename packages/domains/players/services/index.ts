import { Player, PlayerList } from '../../players'
import { Entity, Repository } from '../../shared'

export class PlayerService {
    /**
     * to store the list of players
     */

    private repository: Repository<Player>
    constructor(repository: Repository<Player>) {
        this.repository = repository
    }

    /**
     * The function
     * @returns list of type players
     */
    public getPlayers = (): Promise<(Player & Entity)[]> => {
        return this.repository.getAll()
    }

    public getOnePlayer = (id: number): Promise<Player & Entity> => {
        return this.repository.getOne(id)
    }

    /**
     * This function adds an player to the player list
     * @param Player player
     * @returns Player
     */
    public addPlayer = (player: Player): Promise<Player & Entity> => {
        return this.repository.addOne(player)
    }

    /**
     * This function deletes an player
     * @param player Player
     */
    public deletePlayer = (id: number): Promise<void> => {
        return this.repository.deleteOne(id)
    }

    /**
     * This function updates an player
     * @param oldPlayer Player
     * @param newPlayer Player
     */
    public updatePlayer = (id: number, player: Player): Promise<void> => {
        return this.repository.updateOne(id, player)
    }
}
