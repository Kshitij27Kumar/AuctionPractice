import { Entity, Repository } from '@/shared'
import { ParticipatingPlayer } from '..'

type FilterOptions = {
    tierId?: number
}

export class ParticipatingPlayerList extends Repository<ParticipatingPlayer> {
    public getMany = async (
        options: FilterOptions
    ): Promise<(ParticipatingPlayer & Entity)[]> => {
        const participatingPlayers = await this.getAll()
        return participatingPlayers.filter(
            ({ tierId }: ParticipatingPlayer) => {
                if (!options.tierId) {
                    return true
                }

                return options.tierId === tierId
            }
        )
    }
}
