export type Season = {
    readonly name: string
    readonly startDate: number
    readonly endDate: number
}

export type ParticipatingTeam = {
    readonly seasonId: number
    readonly teamId: number
    readonly captainId?: string
    readonly viceCaptainId?: string
}
