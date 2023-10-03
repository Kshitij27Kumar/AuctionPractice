import { Season, SeasonService } from '..'
import { Team, TeamService } from '@/teams'
import { PlayerService, Player } from '@/players'

describe('Season Service', () => {
    var seasonService: SeasonService
    var teamService: TeamService
    var playerService: PlayerService
    var season1: Season
    var season2: Season
    var player: Player
    var team: Team

    beforeEach(() => {
        seasonService = new SeasonService()
        teamService = new TeamService()
        playerService = new PlayerService()
        season1 = {
            name: 'IPL 1',
            startDate: new Date('2023-10-01').getTime(),
            endDate: new Date('2023-10-04').getTime(),
        }
        season2 = {
            name: 'IPL 2',
            startDate: new Date('2023-10-01').getTime(),
            endDate: new Date('2023-10-04').getTime(),
        }
        team = {
            name: 'CSK',
        }
        player = {
            firstName: 'John',
            lastName: 'Doe',
            country: 'England',
        }
    })

    it('Should be able to fetch a list of seasons', async () => {
        //Given

        //When
        const seasons = await seasonService.getSeasons()

        //Then
        expect(seasons).toEqual([])
    })

    // TODO: Fix promise handling in seasonService.addSeason()
    it('Should not be able to add a season if the end date is earlier than the start date', async () => {
        // Given
        const name = 'IPL 1'
        const startDate = new Date('2023-08-19').getTime()
        const endDate = new Date('2023-08-18').getTime()

        // When
        const error = seasonService.addSeason({
            name,
            startDate,
            endDate,
        })

        // Then
        await expect(error).rejects.toThrowError(
            'end_date_earlier_than_start_date'
        )
    })

    it('Should be able to add a season', async () => {
        // Given

        // When
        const id = await seasonService.addSeason(season1)
        const seasons = await seasonService.getSeasons()

        // Then
        expect(seasons).toEqual([{ ...season1, id }])
    })

    it('Should be able to delete a season', async () => {
        //Given
        const seasonId1 = await seasonService.addSeason(season1)
        const seasonId2 = await seasonService.addSeason(season2)

        //When
        await seasonService.deleteSeason(seasonId2)
        const seasons = await seasonService.getSeasons()

        //Then
        expect(seasons).toEqual([{ ...season1, id: seasonId1 }])
    })

    it('Should be able to update a season', async () => {
        //Given
        const seasonId = await seasonService.addSeason(season1)

        //When
        await seasonService.updateSeason(seasonId, season2)
        const seasons = await seasonService.getSeasons()

        //Then
        expect(seasons).toEqual([{ ...season2, id: seasonId }])
    })

    it('Should be able to get the list of participating teams', async () => {
        //Given
        const seasonId = await seasonService.addSeason(season1)

        //When
        const participatingTeamIds = await seasonService.getTeamIds(seasonId)

        //Then
        expect(participatingTeamIds).toHaveLength(0)
    })

    it('Should be able to add a team to the season', async () => {
        //Given
        const seasonId = await seasonService.addSeason(season1)
        const cskId = await teamService.addTeam(team)
        const mumbaiIndianId = await teamService.addTeam({
            name: 'Mumbai Indians',
        })

        //When
        await seasonService.addTeam(seasonId, cskId)
        await seasonService.addTeam(seasonId, mumbaiIndianId)
        const participatingTeamIds = await seasonService.getTeamIds(seasonId)

        //Then
        expect(participatingTeamIds).toEqual([cskId, mumbaiIndianId])
    })
})
