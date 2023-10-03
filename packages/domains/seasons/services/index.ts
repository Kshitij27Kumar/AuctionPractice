import { Entity } from '@/shared'
import {
    ParticipatingTeam,
    Season,
    SeasonList,
    ParticipatingTeamList,
} from '..'

export class SeasonService {
    /**
     * to store the list of seasons
     */
    private seasons = new SeasonList()
    private participatingTeams = new ParticipatingTeamList()

    /**
     * The method
     * @returns list of type seasons
     */
    public getSeasons = (): Promise<(Season & Entity)[]> => {
        return this.seasons.getAll()
    }

    public getOneSeason = (id: number): Promise<Season & Entity> => {
        return this.seasons.getOne(id)
    }

    /**
     * This method adds an season to the season list
     * @param Season season
     * @returns Season
     */
    public addSeason = (season: Season) => {
        if (season.endDate < season.startDate) {
            return Promise.reject(new Error('end_date_earlier_than_start_date'))
        }

        return this.seasons.addOne(season)
    }

    /**
     * This method deletes an season
     * @param season Season
     */
    public deleteSeason = (id: number): Promise<void> => {
        return this.seasons.deleteOne(id)
    }

    /**
     * This method updates an season
     * @param oldSeason Season
     * @param newSeason Season
     */
    public updateSeason = (id: number, season: Season): Promise<void> => {
        return this.seasons.updateOne(id, season)
    }

    /**
     *  This method returns the teams in a season
     * @param seasonId number
     * @returns ParticipatingTeams[]
     */
    public getTeamIds = async (seasonId: number): Promise<number[]> => {
        const participatingTeams = await this.participatingTeams.getMany({
            seasonId,
        })
        return participatingTeams.map(({ teamId }: ParticipatingTeam) => teamId)
    }

    /**
     * This method adds a team to a season
     * @param seasonId number
     * @param teamId number
     */
    public addTeam = (seasonId: number, teamId: number): Promise<number> => {
        return this.participatingTeams.addOne({ seasonId, teamId })
    }
}
