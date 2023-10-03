import {
    Auction,
    CreateTierDTO,
    Tier,
    AuctionList,
    TierList,
    ParticipatingPlayerList,
    BiddingSessionList,
    BiddingSession,
    SessionStatus,
} from '@/auctions'
import { Entity } from '@/shared'

export class AuctionService {
    /**
     * to store the list of auctions
     */
    private auctions = new AuctionList()
    private tiers = new TierList()
    private participatingPlayers = new ParticipatingPlayerList()
    private biddingSessionList = new BiddingSessionList()

    /**
     * The method
     * @returns list of type auctions
     */
    public getAuctions = (): Promise<(Auction & Entity)[]> => {
        return this.auctions.getAll()
    }

    public getOneAuction = (id: number): Promise<Auction & Entity> => {
        return this.auctions.getOne(id)
    }

    /**
     * This method adds an auction to the auction list
     * @param Auction auction
     * @returns Auction
     */
    public addAuction = (auction: Auction): Promise<number> => {
        if (auction.endDate < auction.startDate) {
            return Promise.reject(new Error('end_date_earlier_than_start_date'))
        }
        return this.auctions.addOne(auction)
    }

    /**
     * This method deletes an auction
     * @param auction Auction
     */
    public deleteAuction = (id: number): Promise<void> => {
        return this.auctions.deleteOne(id)
    }

    /**
     * This method updates an auction
     * @param oldAuction Auction
     * @param newAuction Auction
     */
    public updateAuction = (id: number, auction: Auction): Promise<void> => {
        return this.auctions.updateOne(id, auction)
    }

    /**
     * This method adds a season ID to auction object
     * @param auctionId number
     * @param seasonId number
     * @returns Auction
     */
    public setSeasonId = async (
        auctionId: number,
        seasonId: number
    ): Promise<Auction> => {
        const oldAuction = await this.auctions.getOne(auctionId)
        const newAuction = { ...oldAuction, seasonId }
        await this.auctions.updateOne(auctionId, newAuction)
        return this.auctions.getOne(auctionId)
    }

    /**
     * This method adds a tier to an auction
     * @param auctionId number
     * @param tier Tier
     */
    public createTier = (
        auctionId: number,
        createTierDto: CreateTierDTO
    ): Promise<number> => {
        const tier = { ...createTierDto, auctionId }
        return this.tiers.addOne(tier)
    }

    public getTiers = (auctionId: number): Promise<(Tier & Entity)[]> => {
        return this.tiers.getMany({ auctionId })
    }

    /**
     * This method adds a player to a tier
     * @param tierId number
     * @param playerId number
     */
    public addPlayerToTier = (
        tierId: number,
        playerId: number
    ): Promise<number> => {
        return this.participatingPlayers.addOne({ playerId, tierId })
    }

    public removePlayerFromTier = (
        participatingPlayerId: number
    ): Promise<void> => {
        return this.participatingPlayers.deleteOne(participatingPlayerId)
    }

    /**
     * This method return the list of participating players
     * @param tierId number
     * @returns ParticipatingPlayer[]
     */
    public getParticipatingPlayers = (tierId: number) => {
        return this.participatingPlayers.getMany({ tierId })
    }

    /**
     * Creates a bidding session
     * @param participatingPlayerId
     * @param auctionId
     * @returns number
     */
    public createBiddingSession = (
        participatingPlayerId: number,
        auctionId: number
    ): Promise<number> => {
        const startDateTime = Date.now()

        return this.biddingSessionList.addOne({
            auctionId,
            participatingPlayerId,
            startDateTime,
            status: SessionStatus.LIVE,
        })
    }

    /**
     * Returns the current bidding session
     * @param auctionId number
     * @returns number
     */
    public getCurrentBiddingSession = async (
        auctionId: number
    ): Promise<(BiddingSession & Entity) | undefined> => {
        const biddingSessions = await this.biddingSessionList.getMany({
            auctionId,
            status: SessionStatus.LIVE,
        })

        if (biddingSessions.length > 1) {
            return Promise.reject(new Error('multiple_live_bidding_sessions'))
        }

        return biddingSessions.pop()
    }
}
