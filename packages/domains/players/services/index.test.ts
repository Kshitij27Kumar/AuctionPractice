import { Player, PlayerService } from '@/players'

describe('Player Service', () => {
    var playerService: PlayerService
    var player1: Player
    var player2: Player

    beforeEach(() => {
        playerService = new PlayerService()
        player1 = {
            firstName: 'Virat',
            lastName: 'Kohli',
            country: 'India',
        }
        player2 = {
            firstName: 'John',
            lastName: 'Doe',
            country: 'England',
        }
    })

    it('Should be able to fetch a list of players', async () => {
        //Given

        //When
        const players = await playerService.getPlayers()

        //Then
        expect(players).toEqual([])
    })

    it('Should be able to add an player', async () => {
        // Given

        // When
        const id = await playerService.addPlayer(player1)
        const players = await playerService.getPlayers()

        // Then
        expect(players).toEqual([{ ...player1, id }])
    })

    it('Should be able to delete an player', async () => {
        //Given
        const playerId1 = await playerService.addPlayer(player1)
        const playerId2 = await playerService.addPlayer(player2)

        //When
        await playerService.deletePlayer(playerId2)
        const players = await playerService.getPlayers()

        //Then
        expect(players).toEqual([{ ...player1, id: playerId1 }])
    })

    it('Should be able to update an player', async () => {
        //Given
        const playerId = await playerService.addPlayer(player1)

        //When
        await playerService.updatePlayer(playerId, player2)
        const players = await playerService.getPlayers()

        //Then
        expect(players).toEqual([{ ...player2, id: playerId }])
    })
})
