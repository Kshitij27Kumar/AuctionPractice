import { Alert, Button, Col, Drawer, Form, Input, Row, Space } from 'antd'
import { Entity, ObjectId, Player } from 'domains'
import React, { useEffect, useState } from 'react'
import {
    addPlayer,
    deletePlayer,
    getPlayers,
    updatePlayer,
} from '../../../services/player'
import PlayerList from './list'
import PlayerForm from './form'

type DrawerState = {
    isDrawerOpen: boolean
    playerId?: ObjectId
}

const { Search } = Input

const Root = () => {
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
            const players = await getPlayers()
            setPlayers(players)
            setError(false)
        } catch (error) {
            setError(true)
            setPlayers([])
        }
    }

    const onDeleteClick = async (id: number) => {
        await deletePlayer(id)
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
                <PlayerForm addPlayer={addPlayer} updatePlayer={updatePlayer} />
            </Drawer>
        </>
    )
}

export default Root
