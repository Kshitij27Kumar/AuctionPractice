import { CreateTierDTO, Auction, AuctionService } from '..'
import { Player, PlayerService } from '@/players'
import { SeasonService, Season } from '@/seasons'

describe('Auction Service', () => {
    var auctionService: AuctionService
    var seasonService: SeasonService
    var playerService: PlayerService

    var auction1: Auction
    var auction2: Auction
    var season: Season
    var tier1: CreateTierDTO
    var players: Player[]

    beforeEach(() => {
        auctionService = new AuctionService()
        seasonService = new SeasonService()
        playerService = new PlayerService()

        auction1 = {
            name: 'IPL 1',
            startDate: new Date('2023-10-01').getTime(),
            endDate: new Date('2023-10-04').getTime(),
        }
        auction2 = {
            name: 'IPL 2',
            startDate: new Date('2023-10-01').getTime(),
            endDate: new Date('2023-10-04').getTime(),
        }
        season = {
            name: 'TATA IPL 2023',
            startDate: new Date('2023-10-01').getTime(),
            endDate: new Date('2023-10-04').getTime(),
        }

        tier1 = {
            name: 'Tier 1',
            basePrice: 2_000_000,
            currency: 'USD',
        }

        players = [
            {
                firstName: 'Virat',
                lastName: 'Kohli',
                country: 'India',
            },
            {
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
            {
                firstName: 'David',
                lastName: 'Warner',
                country: 'Australia',
            },
            {
                firstName: 'Rashid',
                lastName: 'Khan',
                country: 'Afghanistan',
            },
            {
                firstName: 'Jasprit',
                lastName: 'Bumrah',
                country: 'India',
            },
            {
                firstName: 'Kuldeep',
                lastName: 'Yadav',
                country: 'India',
            },
            {
                firstName: 'Ravindra',
                lastName: 'Jadeja',
                country: 'India',
            },
            {
                firstName: 'Cameron',
                lastName: 'Green',
                country: 'Australia',
            },
            {
                firstName: 'Hardik',
                lastName: 'Pandya',
                country: 'India',
            },
        ]
    })

    it('Should be able to fetch a list of auctions', async () => {
        //Given

        //When
        const auctions = await auctionService.getAuctions()

        //Then
        expect(auctions).toEqual([])
    })

    it('Should not be able to add an auction if the end date is earlier than the start date', async () => {
        // Given
        const name = 'IPL 1'
        const startDate = new Date('2023-08-19').getTime()
        const endDate = new Date('2023-08-18').getTime()

        // When

        const error = auctionService.addAuction({ name, startDate, endDate })

        // Then
        await expect(error).rejects.toThrowError(
            'end_date_earlier_than_start_date'
        )
    })

    it('Should be able to add an auction', async () => {
        // Given

        // When
        const id = await auctionService.addAuction(auction1)
        const auctions = await auctionService.getAuctions()

        // Then
        expect(auctions).toEqual([{ ...auction1, id }])
    })

    it('Should be able to delete an auction', async () => {
        //Given
        const auctionId1 = await auctionService.addAuction(auction1)
        const auctionId2 = await auctionService.addAuction(auction2)

        //When
        await auctionService.deleteAuction(auctionId2)
        const auctions = await auctionService.getAuctions()

        //Then
        expect(auctions).toEqual([{ ...auction1, id: auctionId1 }])
    })

    it('Should be able to update an auction', async () => {
        //Given
        const auction1Id = await auctionService.addAuction(auction1)

        //When
        await auctionService.updateAuction(auction1Id, auction2)
        const auctions = await auctionService.getAuctions()

        //Then
        expect(auctions).toEqual([{ ...auction2, id: auction1Id }])
    })

    it('Should be able to add season id to an auction', async () => {
        //Given
        const auctionId = await auctionService.addAuction(auction1)
        const seasonId = await seasonService.addSeason(season)

        //When
        const auction = await auctionService.setSeasonId(auctionId, seasonId)

        //Then
        expect(auction).toEqual({ ...auction1, id: auctionId, seasonId })
    })

    it('Should create an auciton with a tier', async () => {
        // Given
        const auctionId = await auctionService.addAuction(auction1)

        // When
        const tierId = await auctionService.createTier(auctionId, tier1)
        const tiers = await auctionService.getTiers(auctionId)

        // Then
        expect(tiers).toEqual([{ ...tier1, id: tierId, auctionId }])
    })

    it('Should be able to add players to a tier', async () => {
        // Given
        const auctionId = await auctionService.addAuction(auction1)
        const playerIds = await Promise.all(
            players.map(playerService.addPlayer)
        )

        // When
        const tierId = await auctionService.createTier(auctionId, tier1)
        const participatingPlayerId1 = await auctionService.addPlayerToTier(
            tierId,
            playerIds[0]
        )
        const participatingPlayerId2 = await auctionService.addPlayerToTier(
            tierId,
            playerIds[1]
        )
        const participatingPlayers =
            await auctionService.getParticipatingPlayers(tierId)

        // Then
        expect(participatingPlayers).toEqual([
            { tierId, playerId: playerIds[0], id: participatingPlayerId1 },
            { tierId, playerId: playerIds[1], id: participatingPlayerId2 },
        ])
    })

    it('Should be able to remove players from tier', async () => {
        // Given
        const auctionId = await auctionService.addAuction(auction1)
        const playerIds = await Promise.all(
            players.map(playerService.addPlayer)
        )

        // When
        const tierId = await auctionService.createTier(auctionId, tier1)
        const participatingPlayerId1 = await auctionService.addPlayerToTier(
            tierId,
            playerIds[0]
        )
        const participatingPlayerId2 = await auctionService.addPlayerToTier(
            tierId,
            playerIds[1]
        )
        await auctionService.removePlayerFromTier(participatingPlayerId1)
        const participatingPlayers =
            await auctionService.getParticipatingPlayers(tierId)

        // Then
        expect(participatingPlayers).toEqual([
            { tierId, playerId: playerIds[1], id: participatingPlayerId2 },
        ])
    })

    // // throw new Error ('Write test case for removing player from tier')

    it('Should be able to start an auction and get status', async () => {
        // Given
        const auctionId = await auctionService.addAuction(auction1)
        const tierId = await auctionService.createTier(auctionId, tier1)
        const playerIds = await Promise.all(
            players.map(playerService.addPlayer)
        )

        playerIds.forEach(
            async (playerId) =>
                await auctionService.addPlayerToTier(tierId, playerId)
        )
    })

    it('Should create a bidding session for participating player', async () => {
        // Given
        const auctionId = await auctionService.addAuction(auction1)
        const tierId = await auctionService.createTier(auctionId, tier1)

        const playerIdPromises = players.map(playerService.addPlayer)
        const playerIds = await Promise.all(playerIdPromises)

        const participatingPlayerPromises = playerIds.map((playerId) =>
            auctionService.addPlayerToTier(tierId, playerId)
        )
        const participatingPlayerIds = await Promise.all(
            participatingPlayerPromises
        )

        // When
        const biddingSessionId = await auctionService.createBiddingSession(
            participatingPlayerIds[0],
            auctionId
        )

        const biddingSession =
            await auctionService.getCurrentBiddingSession(auctionId)

        // Then
        expect(biddingSession!.id).toEqual(biddingSessionId)
    })

    describe('Bidding Sessions', () => {
        var auctionService: AuctionService

        it('Should not be able to get the current bidding session if bidding has not started', async () => {
            //Given
            auctionService = new AuctionService()
            const auctionId = await auctionService.addAuction(auction1)

            //When
            const currentBiddingSession =
                await auctionService.getCurrentBiddingSession(auctionId)
            //Then
            expect(currentBiddingSession).toBeUndefined()
        })
    })
})

//Start Bidding Session
//  Get Random Player by Tier -- Auction
//  Place initial bid
//  Place bids
//  Stop session
//  Send player to highest bidding team -- Player to TeamPlayer
//  Remove player from tier

// Where should bidding session exist, in AuctionService or as a seperate entity?
// The auction must pick a player from a tier and start a bidding session for that player
// Should we pass the tier object or all the parameters seperately to the bidding session?
