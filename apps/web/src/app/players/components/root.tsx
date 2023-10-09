import { Alert, Button, Col, Drawer, Input, Row } from 'antd'
import { Entity, ObjectId, Player } from 'domains'
import {
    DeletePlayerService,
    GetAllPlayersService,
} from '../../../services/player'
import React, { useEffect, useState } from 'react'
import PlayerList from './list'
import PlayerForm from './form'
import { withPlayerService } from '../../shared/hoc'

type DrawerState = {
    isDrawerOpen: boolean
    playerId?: ObjectId
}

const { Search } = Input

interface RootProps {
    service: GetAllPlayersService & DeletePlayerService
}

const Root = ({ service }: RootProps) => {
    const [drawerState, setDrawerState] = useState<DrawerState>({
        playerId: undefined,
        isDrawerOpen: false,
    })
    const [players, setPlayers] = useState<(Player & Entity)[]>([])
    const [error, setError] = useState(false)

    const resetDrawerState = () => {
        setDrawerState({ isDrawerOpen: false })
    }

    const refreshPlayers = async () => {
        try {
            const players = await service.getPlayers()
            setPlayers(players)
            setError(false)
        } catch (error) {
            setError(true)
            setPlayers([])
        }
    }

    const onDeleteClick = async (id: number) => {
        await service.deletePlayer(id)
        refreshPlayers()
    }

    const onEditClick = (playerId: number) => {
        setDrawerState({
            isDrawerOpen: true,
            playerId,
        })
    }

    const onAddClick = () => {
        setDrawerState({
            isDrawerOpen: true,
            playerId: undefined,
        })
    }

    const successHandler = async () => {
        await refreshPlayers()
        setError(false)
    }

    const failureHandler = () => {
        setError(true)
    }

    useEffect(() => {
        refreshPlayers()
    }, [])

    useEffect(() => {
        const { playerId } = drawerState
        setFormFields(playerId)
    }, [drawerState])

    const setFormFields = (playerId: number | undefined) => {
        let player: Player | undefined

        if (playerId) {
            player = players.find(({ id }: Entity) => id === playerId)
        }
    }

    return (
        <>
            <Row justify="space-around">
                <Col span={16}>
                    <Search placeholder="Search Player" enterButton />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={onAddClick}>
                        Add Player
                    </Button>
                </Col>
            </Row>

            {error && (
                <Alert
                    data-testid="player-error"
                    message="Error"
                    description="Something went wrong. Please try again."
                    type="error"
                    showIcon={true}
                />
            )}

            <PlayerList
                players={players}
                handleDelete={onDeleteClick}
                handleEdit={onEditClick}
            />
            {/* <PlayerList defaultPlayers={players} onChange={}/> */}

            <Drawer
                data-testid="add-player-drawer"
                title={drawerState.playerId ? 'Edit Player' : 'Add Player'}
                width={400}
                open={drawerState.isDrawerOpen}
                onClose={resetDrawerState}
            >
                <PlayerForm
                    onSuccess={successHandler}
                    onFailure={failureHandler}
                />
            </Drawer>
        </>
    )
}

export default withPlayerService(Root)
