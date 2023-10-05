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
    const [form] = Form.useForm()

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

    const editPlayerSubmit = async (player: Player) => {
        await updatePlayer(drawerState.playerId!, player)
        refreshPlayers()
        resetDrawerState()
    }

    const addPlayerSubmit = async (player: Player) => {
        try {
            await addPlayer(player)
            refreshPlayers()
            resetDrawerState()
            setError(false)
        } catch (error) {
            setError(true)
        }
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

        if (player) {
            form.setFieldsValue(player)
        } else {
            form.resetFields()
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

            <Drawer
                data-testid="add-player-drawer"
                title={drawerState.playerId ? 'Edit Player' : 'Add Player'}
                width={400}
                open={drawerState.isDrawerOpen}
                onClose={resetDrawerState}
            >
                <Form
                    title="player-form"
                    form={form}
                    onFinish={(player: Player) => {
                        drawerState.playerId
                            ? editPlayerSubmit(player)
                            : addPlayerSubmit(player)
                    }}
                >
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter first name',
                            },
                            {
                                pattern: /^[a-z\s]+$/i,
                                message: 'First name is invalid',
                            },
                        ]}
                    >
                        <Input placeholder="Please enter first name" />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter last name',
                            },
                            {
                                pattern: /^[a-z\s]+$/i,
                                message: 'Last name is invalid',
                            },
                        ]}
                    >
                        <Input placeholder="Please enter last name" />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a country',
                            },
                        ]}
                    >
                        <select className="ant-col ant-form-item-control ant-form-item-control-input ant-form-item-control-input-content">
                            <option selected>-- select an option --</option>
                            <option value={'india'}>India</option>
                            <option value={'australia'}>Australia</option>
                            <option value={'england'}>England</option>
                            <option value={'sri lanka'}>Sri Lanka</option>
                            <option value={'west indies'}>West Indies</option>
                            <option value={'afghanistan'}>Afghanistan</option>
                            <option value={'new zealand'}>New Zealand</option>
                            <option value={'bangladesh'}>Bangladesh</option>
                            <option value={'south africa'}>South Africa</option>
                        </select>
                    </Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="reset">Reset</Button>
                    </Space>
                </Form>
            </Drawer>
        </>
    )
}

export default Root
