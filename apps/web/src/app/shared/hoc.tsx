import { PlayerService } from '../../services/player'

export const withPlayerService = (Component: any) => (props: any) => {
    const service = new PlayerService()
    return <Component {...props} service={service} />
}
