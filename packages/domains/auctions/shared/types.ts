export type Auction = {
    readonly name: string
    readonly startDate: number
    readonly endDate: number
    readonly seasonId?: number
}

export type CreateTierDTO = {
    readonly name: string
    readonly basePrice: number
    readonly currency: string
}

export type Tier = {
    readonly name: string
    readonly basePrice: number
    readonly currency: string
    readonly auctionId: number
}

export type ParticipatingPlayer = {
    readonly playerId: number
    readonly tierId: number
}

export enum SessionStatus {
    SCHEDULED = 'scheduled',
    LIVE = 'live',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export type BiddingSession = {
    readonly participatingPlayerId: number
    readonly auctionId: number
    readonly startDateTime: number
    readonly endDateTime?: number
    readonly status: SessionStatus
}
