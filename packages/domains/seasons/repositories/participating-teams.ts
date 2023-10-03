import { Repository, Entity } from '@/shared'
import { ParticipatingTeam } from '..'

type FilterOptions = {
    seasonId?: number
}

export class ParticipatingTeamList extends Repository<ParticipatingTeam> {
    public getMany = async (
        options: FilterOptions
    ): Promise<(ParticipatingTeam & Entity)[]> => {
        const participatingTeams = await this.getAll()

        return Promise.resolve(
            participatingTeams.filter(({ seasonId }: ParticipatingTeam) => {
                if (!options.seasonId) {
                    return true
                }
                return options.seasonId === seasonId
            })
        )
    }
}
