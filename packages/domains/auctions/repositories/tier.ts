import { Entity, Repository } from '@/shared'
import { Tier } from '..'

type FilterOptions = {
    auctionId?: number
}

export class TierList extends Repository<Tier> {
    public getMany = async (
        options: FilterOptions
    ): Promise<(Tier & Entity)[]> => {
        const tiers = await this.getAll()
        return Promise.resolve(
            tiers.filter(
                ({ auctionId }: Tier) => options.auctionId === auctionId
            )
        )
    }
}
