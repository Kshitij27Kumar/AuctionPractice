import { Client, ConnectionConfig, QueryResult } from 'pg'

export interface DatabaseType {
    query(text: string, values?: string[]): Promise<QueryResult<any>>
}

export default class Database implements DatabaseType {
    private static database: Database
    private client: Client

    private constructor() {
        const config: ConnectionConfig = {
            database: 'auction',
        }
        this.client = new Client(config)
    }

    public static getInstance = () => {
        if (!Database.database) {
            Database.database = new Database()
        }
        return Database.database
    }

    public connect = async () => {
        try {
            await this.client.connect()
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    public query = async (
        text: string,
        values?: string[]
    ): Promise<QueryResult<any>> => {
        if (values) {
            return this.client.query(text, values)
        } else {
            return this.client.query(text)
        }
    }
}
