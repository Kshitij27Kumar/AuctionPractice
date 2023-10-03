import { Entity } from '.'

export abstract class Repository<T> {
    private idCounter: number
    private list: (T & Entity)[] = []

    constructor() {
        this.idCounter = 0
    }

    private getNextId = (): number => {
        return ++this.idCounter
    }

    public getAll = (): Promise<(T & Entity)[]> => {
        return Promise.resolve(this.list)
    }

    public getOne = (id: number): Promise<T & Entity> => {
        const object = this.list.find((object: T & Entity) => object.id === id)

        if (!object) {
            return Promise.reject(new Error('does_not_exist'))
        }

        return Promise.resolve(object)
    }

    public addOne = (object: T): Promise<number> => {
        const id = this.getNextId()
        this.list = [...this.list, { ...object, id }]
        return Promise.resolve(id)
    }

    public deleteOne = (id: number): Promise<void> => {
        const currentLength = this.list.length
        this.list = this.list.filter((object: T & Entity) => object.id !== id)

        if (this.list.length === currentLength) {
            return Promise.reject(new Error('does_not_exist'))
        }

        return Promise.resolve()
    }

    public updateOne = (id: number, object: T): Promise<void> => {
        const index = this.list.findIndex(
            (object: T & Entity) => object.id === id
        )
        this.list[index] = { ...object, id }
        this.list = [...this.list]
        return Promise.resolve()
    }
}
