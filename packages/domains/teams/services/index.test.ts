import { Team, TeamService } from '..'

describe('Team Service', () => {
    var teamService: TeamService
    var team1: Team
    var team2: Team

    beforeEach(() => {
        teamService = new TeamService()
        team1 = {
            name: 'KKR',
        }
        team2 = {
            name: 'CSK',
        }
    })

    it('Should be able to fetch a list of teams', async () => {
        //Given

        //When
        const teams = await teamService.getTeams()

        //Then
        expect(teams).toEqual([])
    })

    it('Should be able to add an team', async () => {
        // Given

        // When
        const id = await teamService.addTeam(team1)
        const teams = await teamService.getTeams()

        // Then
        expect(teams).toEqual([{ ...team1, id }])
    })

    it('Should be able to delete an team', async () => {
        //Given
        const teamId1 = await teamService.addTeam(team1)
        const teamId2 = await teamService.addTeam(team2)

        //When
        await teamService.deleteTeam(teamId2)
        const teams = await teamService.getTeams()

        //Then
        expect(teams).toEqual([{ ...team1, id: teamId1 }])
    })

    it('Should be able to update an team', async () => {
        //Given
        const teamId = await teamService.addTeam(team1)

        //When
        await teamService.updateTeam(teamId, team2)
        const teams = await teamService.getTeams()

        //Then
        expect(teams).toEqual([{ ...team2, id: teamId }])
    })
})
