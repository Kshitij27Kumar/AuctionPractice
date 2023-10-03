'use client'
import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Input,
    Button,
    Space,
    Table,
    Popconfirm,
    Drawer,
    Form,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Entity, ObjectId } from 'domains'
import { Team, TeamService } from 'domains'

const { Search } = Input

type DrawerState = {
    isDrawerOpen: boolean
    teamId?: ObjectId
}

class TestTeamService extends TeamService {
    constructor() {
        super()
        this.loadInitialData()
    }

    private loadInitialData = async () => {
        await this.addTeam({
            name: 'Mumbai Indians',
        })
        await this.addTeam({
            name: 'Chennai Super Kings',
        })
    }
}

const teamService = new TestTeamService()

const Teams = () => {
    const [drawerState, setDrawerState] = useState<DrawerState>({
        teamId: undefined,
        isDrawerOpen: false,
    })
    const [form] = Form.useForm()
    const [teams, setTeams] = useState<(Team & Entity)[]>([])

    const onAddClick = () => {
        setDrawerState({
            isDrawerOpen: true,
            teamId: undefined,
        })
    }

    const onEditClick = (teamId: number) => {
        setDrawerState({ isDrawerOpen: true, teamId })
    }

    const refreshTeams = async () => {
        const teams = await teamService.getTeams()
        setTeams(teams)
    }

    const resetDrawerState = () => {
        setDrawerState({ isDrawerOpen: false })
    }

    const addTeamSubmit = async (team: Team) => {
        await teamService.addTeam(team)
        refreshTeams()
        resetDrawerState()
    }

    const handleDeleteTeam = async (id: number) => {
        await teamService.deleteTeam(id)
        refreshTeams()
    }

    const editTeamSubmit = async (team: Team) => {
        await teamService.updateTeam(drawerState.teamId!, team)
        refreshTeams()
        resetDrawerState()
    }

    useEffect(() => {
        refreshTeams()
    }, [])

    const setFormFields = (teamId: number | undefined) => {
        let team: Team | undefined

        if (teamId) {
            team = teams.find(({ id }: Entity) => id === teamId)
        }

        if (team) {
            form.setFieldsValue(team)
        } else {
            form.resetFields()
        }
    }

    useEffect(() => {
        const { teamId } = drawerState
        setFormFields(teamId)
    }, [drawerState])

    const columns: ColumnsType<Team & Entity> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Team Name',
            dataIndex: 'name',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, { id }) => (
                <Space size="middle">
                    <Button onClick={() => onEditClick(id)}>Edit</Button>
                    <Popconfirm
                        title="Delete Team"
                        description="Are you sure?"
                        onConfirm={() => handleDeleteTeam(id)}
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
                    <Search placeholder="Search Team" enterButton />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={onAddClick}>
                        Add Team
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={teams}
                data-testid="teams-table"
            ></Table>
            <Drawer
                data-testid="add-team-drawer"
                title={drawerState.teamId ? 'Edit Team' : 'Add Team'}
                width={400}
                open={drawerState.isDrawerOpen}
                onClose={resetDrawerState}
            >
                <Form
                    title="team-form"
                    form={form}
                    onFinish={(team: Team) => {
                        drawerState.teamId
                            ? editTeamSubmit(team)
                            : addTeamSubmit(team)
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Team Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter team name',
                            },
                            {
                                pattern: /^[a-z\s]+$/i,
                                message: 'Team name is invalid',
                            },
                        ]}
                    >
                        <Input placeholder="Enter team name" />
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

export default Teams
