import { Entity } from '@/shared'
import { Team, TeamList } from '..'

export class TeamService {
    /**
     * to store the list of teams
     */
    private teamsList = new TeamList()

    /**
     * The function
     * @returns list of type teams
     */
    public getTeams = (): Promise<(Team & Entity)[]> => {
        return this.teamsList.getAll()
    }

    public getOneTeam = (id: number): Promise<Team & Entity> => {
        return this.teamsList.getOne(id)
    }

    /**
     * This function adds an team to the team list
     * @param Team team
     * @returns Team
     */
    public addTeam = (team: Team): Promise<number> => {
        return this.teamsList.addOne(team)
    }

    /**
     * This function deletes an team
     * @param team Team
     */
    public deleteTeam = (id: number): Promise<void> => {
        return this.teamsList.deleteOne(id)
    }

    /**
     * This function updates an team
     * @param oldTeam Team
     * @param newTeam Team
     */
    public updateTeam = (id: number, team: Team): Promise<void> => {
        return this.teamsList.updateOne(id, team)
    }
}
