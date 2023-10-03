'use client'
import React, { useEffect, useState } from 'react'
import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Row,
    Space,
    Table,
    DatePicker,
    Popconfirm,
} from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { Season, SeasonService } from 'domains'
import { Entity, ObjectId } from 'domains'

type DrawerState = {
    isDrawerOpen: boolean
    seasonId?: ObjectId
}

class TestSeasonService extends SeasonService {
    constructor() {
        super()
        this.loadInitialData()
    }
    private loadInitialData = async () => {
        await this.addSeason({
            name: 'IPL 2008',
            startDate: new Date('2008-04-01').getTime(),
            endDate: new Date('2008-05-27').getTime(),
        })
        await this.addSeason({
            name: 'IPL 2023',
            startDate: new Date('2023-04-05').getTime(),
            endDate: new Date('2023-06-02').getTime(),
        })
    }
}

const seasonService = new TestSeasonService()

const Seasons = () => {
    const [seasons, setSeasons] = useState<(Season & Entity)[]>([])
    const [drawerState, setDrawerState] = useState<DrawerState>({
        seasonId: undefined,
        isDrawerOpen: false,
    })
    const [form] = Form.useForm()
    const [startDate, setStartDate] = useState<Date>()

    const resetDrawerState = () => {
        setDrawerState({ isDrawerOpen: false })
    }

    const onAddClick = () => {
        setDrawerState({ isDrawerOpen: true, seasonId: undefined })
    }

    const onEditClick = (seasonId: number) => {
        setDrawerState({
            isDrawerOpen: true,
            seasonId,
        })
    }

    const refreshSeasons = async () => {
        const seasons = await seasonService.getSeasons()
        setSeasons(seasons)
    }

    const handleDeleteSeason = async (id: number) => {
        await seasonService.deleteSeason(id)
        refreshSeasons()
    }

    const addSeasonSubmit = async (season: Season) => {
        const parsedSeason = {
            ...season,
            startDate: new Date(season.startDate).getTime(),
            endDate: new Date(season.endDate).getTime(),
        }
        await seasonService.addSeason(parsedSeason)
        refreshSeasons()
        resetDrawerState()
    }

    const editSeasonSubmit = async (season: Season) => {
        const parsedSeason = {
            ...season,
            startDate: new Date(season.startDate).getTime(),
            endDate: new Date(season.endDate).getTime(),
        }
        await seasonService.updateSeason(drawerState.seasonId!, parsedSeason)
        refreshSeasons()
        resetDrawerState()
    }

    useEffect(() => {
        refreshSeasons()
    }, [])

    const setFormFields = (seasonId: number | undefined) => {
        let season: Season | undefined

        if (seasonId) {
            season = seasons.find(({ id }: Entity) => id === seasonId)
        }

        if (season) {
            form.setFieldsValue({
                ...season,
                startDate: dayjs(season.startDate),
                endDate: dayjs(season.endDate),
            })
        } else {
            form.resetFields()
        }
    }

    useEffect(() => {
        const { seasonId } = drawerState
        setFormFields(seasonId)
    }, [drawerState])

    const columns: ColumnsType<Season & Entity> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Season Name',
            dataIndex: 'name',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            render: (_, { startDate }) => new Date(startDate).toDateString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            render: (_, { endDate }) => new Date(endDate).toDateString(),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (_, { id }) => (
                <Space size="middle">
                    <Button onClick={() => onEditClick(id)}>Edit</Button>
                    <Popconfirm
                        title="Delete Season"
                        description="Are you sure?"
                        onConfirm={() => handleDeleteSeason(id)}
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
                    <Search placeholder="Search Season" enterButton />
                </Col>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={onAddClick}
                        data-testid="addSeasonButton"
                    >
                        Add Season
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                data-testid="seasons-table"
                dataSource={seasons}
            ></Table>
            <Drawer
                data-testid="add-season-drawer"
                title={drawerState.seasonId ? 'Edit Season' : 'Add Season'}
                width={400}
                open={drawerState.isDrawerOpen}
                onClose={resetDrawerState}
            >
                <Form
                    title="season-form"
                    onFinish={(season: Season) => {
                        drawerState.seasonId
                            ? editSeasonSubmit(season)
                            : addSeasonSubmit(season)
                    }}
                    form={form}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter season name',
                            },
                            {
                                pattern: /^[a-z0-9\s]+$/i,
                                message: 'Season name is invalid',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Please enter season name"
                            data-testid="seasonName"
                        />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter start date',
                            },
                        ]}
                    >
                        {/* <input type="date" data-testid="startDate" /> */}
                        <DatePicker
                            showNow={true}
                            onChange={(_, dateString) =>
                                setStartDate(() => new Date(dateString))
                            }
                            data-testid="startDate"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter end date',
                            },
                        ]}
                    >
                        {/* <input type="date" data-testid="endDate" /> */}
                        <DatePicker
                            showNow={true}
                            disabledDate={(currentDate) =>
                                currentDate.isBefore(startDate)
                            }
                            data-testid="endDate"
                        />
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

export default Seasons
