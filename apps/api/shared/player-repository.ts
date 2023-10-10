import { Repository, Player, Entity, ObjectId } from 'domains'
import { DatabaseType } from './database'
export class PlayerRepository implements Repository<Player> {
    private database: DatabaseType

    constructor(database: DatabaseType) {
        this.database = database
    }

    public getAll = async (): Promise<(Player & Entity)[]> => {
        const result = await this.database.query('select * from players')
        return result.rows
    }

    public getOne = async (id: ObjectId): Promise<Player & Entity> => {
        const result = await this.database.query(
            `select * from players where id=${id}`
        )
        return result.rows[0]
    }

    public addOne = async ({
        firstName,
        lastName,
        country,
    }: Player): Promise<Player & Entity> => {
        const result = await this.database.query(
            `insert into players(firstName, lastName, country) RETURNING * VALUES (${firstName}, ${lastName}, ${country})`
        )

        return result.rows[0]
    }

    public deleteOne = async (id: ObjectId): Promise<void> => {
        const result = await this.database.query(
            `delete from players where id = ${id}`
        )
    }

    public updateOne = async (id: ObjectId, player: Player): Promise<void> => {
        const result = this.database.query(
            `update players SET firstName = $1, lastName = $2, country = $3 where id =${id} RETURNING *`,
            [player.firstName, player.lastName, player.country]
        )
    }
}
