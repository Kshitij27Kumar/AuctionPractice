'use client'
import { Player, PlayerService } from '@/players'
import { Entity, ObjectId } from '@/shared'
import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Row,
    Space,
    Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const { Search } = Input

type DrawerState = {
    isDrawerOpen: boolean
    playerId?: ObjectId
}

class TestPlayerService extends PlayerService {
    constructor() {
        super()
        this.loadInitialData()
    }

    private loadInitialData = async () => {
        await this.addPlayer({
            firstName: 'Rohit',
            lastName: 'Sharma',
            country: 'india',
        })
        await this.addPlayer({
            firstName: 'Matthew',
            lastName: 'Wade',
            country: 'australia',
        })
    }
}

const playerService = new TestPlayerService()

const Players = () => {
    const [drawerState, setDrawerState] = useState<DrawerState>({
        playerId: undefined,
        isDrawerOpen: false,
    })
    const [players, setPlayers] = useState<(Player & Entity)[]>([])
    const [form] = Form.useForm()

    const refreshPlayers = async () => {
        const players = await playerService.getPlayers()
        setPlayers(players)
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

    const resetDrawerState = () => {
        setDrawerState({ isDrawerOpen: false })
    }

    const handleDeletePlayer = async (id: number) => {
        await playerService.deletePlayer(id)
        refreshPlayers()
    }

    const addPlayerSubmit = async (player: Player) => {
        await playerService.addPlayer(player)
        refreshPlayers()
        resetDrawerState()
    }

    const editPlayerSubmit = async (player: Player) => {
        await playerService.updatePlayer(drawerState.playerId!, player)
        refreshPlayers()
        resetDrawerState()
    }

    useEffect(() => {
        refreshPlayers()
    }, [])

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

    useEffect(() => {
        const { playerId } = drawerState
        setFormFields(playerId)
    }, [drawerState])

    const columns: ColumnsType<Player & Entity> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            render: (_, { country }) => country.toUpperCase(),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, { id }) => (
                <Space size="middle">
                    <Button onClick={() => onEditClick(id)}>Edit</Button>
                    <Popconfirm
                        title="Delete Player"
                        description="Are you sure?"
                        onConfirm={() => handleDeletePlayer(id)}
                    >
                        <Button danger={true}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

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
            <Table
                columns={columns}
                dataSource={players}
                data-testid="players-table"
            ></Table>
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

export default Players
