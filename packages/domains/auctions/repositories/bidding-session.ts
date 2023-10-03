import { Entity, Repository } from '@/shared'
import { BiddingSession, SessionStatus } from '@/auctions'

type FilterOptions = {
    auctionId?: number
    status?: SessionStatus
}

export class BiddingSessionList extends Repository<BiddingSession> {
    public getMany = async (
        options: FilterOptions
    ): Promise<(BiddingSession & Entity)[]> => {
        const biddingSessions = await this.getAll()

        return biddingSessions
            .filter(({ auctionId }: BiddingSession) => {
                if (options.auctionId) {
                    return auctionId === options.auctionId
                }

                return true
            })
            .filter(({ status }: BiddingSession) => {
                if (options.status) {
                    return status == options.status
                }

                return true
            })
    }
}
