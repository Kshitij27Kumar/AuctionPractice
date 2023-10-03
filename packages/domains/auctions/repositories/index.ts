import { Repository } from '@/shared'
import { Auction } from '..'
import { BiddingSessionList } from './bidding-session'
import { ParticipatingPlayerList } from './participating-player'
import { TierList } from './tier'

export default class AuctionList extends Repository<Auction> {}

export { BiddingSessionList, ParticipatingPlayerList, TierList }
