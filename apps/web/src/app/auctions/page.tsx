'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
    Button,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Row,
    Space,
    Table,
} from 'antd'
import Search from 'antd/es/input/Search'
import { ColumnsType } from 'antd/es/table'
import type { Auction } from 'domains'
import { AuctionService } from 'domains'
import type { Entity, ObjectId } from 'domains'

type DrawerState = {
    isDrawerOpen: boolean
    auctionId?: ObjectId
}

class TestAuctionService extends AuctionService {
    constructor() {
        super()
        this.loadInitialData()
    }

    private loadInitialData = async () => {
        await this.addAuction({
            name: 'IPL 1',
            startDate: new Date('2023-09-01').getTime(),
            endDate: new Date('2023-09-02').getTime(),
        })
        await this.addAuction({
            name: 'IPL 2',
            startDate: new Date('2023-10-01').getTime(),
            endDate: new Date('2023-10-02').getTime(),
        })
    }
}

const auctionService = new TestAuctionService()

const Auctions = () => {
    const [drawerState, setDrawerState] = useState<DrawerState>({
        auctionId: undefined,
        isDrawerOpen: false,
    })
    const [auctions, setAuctions] = useState<(Auction & Entity)[]>([])
    const [startDate, setStartDate] = useState<Date>()
    const [form] = Form.useForm()

    const refreshAuctions = async () => {
        const auctions = await auctionService.getAuctions()
        setAuctions(auctions)
    }

    const onAddClick = () => {
        setDrawerState({ isDrawerOpen: true, auctionId: undefined })
    }

    const onEditClick = (auctionId: number) => {
        setDrawerState({
            isDrawerOpen: true,
            auctionId,
        })
    }

    const resetDrawerState = () => {
        setDrawerState({ isDrawerOpen: false })
    }

    const addAuctionSubmit = async (auction: Auction) => {
        await auctionService.addAuction(auction)
        refreshAuctions()
        resetDrawerState()
    }

    const handleDeleteAuction = async (id: number) => {
        await auctionService.deleteAuction(id)
        refreshAuctions()
    }

    const editAuctionSubmit = async (auction: Auction) => {
        await auctionService.updateAuction(drawerState.auctionId!, auction)
        refreshAuctions()
        resetDrawerState()
    }

    const columns: ColumnsType<Auction & Entity> = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Auction Name',
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
            title: 'Action',
            dataIndex: 'action',
            render: (_, { id }) => (
                <Space size="middle">
                    <Button onClick={() => onEditClick(id)}>Edit</Button>
                    <Popconfirm
                        title="Delete Auction"
                        description="Are you sure?"
                        onConfirm={() => handleDeleteAuction(id)}
                    >
                        <Button danger={true}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    useEffect(() => {
        refreshAuctions()
    }, [])

    const setFormFields = (auctionId: number | undefined) => {
        let auction: Auction | undefined

        if (auctionId) {
            auction = auctions.find(({ id }: Entity) => id === auctionId)
        }

        if (auction) {
            form.setFieldsValue({
                ...auction,
                startDate: dayjs(auction.startDate),
                endDate: dayjs(auction.endDate),
            })
        } else {
            form.resetFields()
        }
    }

    useEffect(() => {
        setFormFields(drawerState.auctionId)
    }, [drawerState])

    return (
        <>
            <Row justify="space-around">
                <Col span={16}>
                    <Search placeholder="Search Auction" enterButton />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={onAddClick}>
                        Add Auction
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={auctions}
                data-testid="auctions-table"
            ></Table>
            <Drawer
                data-testid="add-auction-drawer"
                title={drawerState.auctionId ? 'Edit Auction' : 'Add Auction'}
                width={400}
                open={drawerState.isDrawerOpen}
                onClose={resetDrawerState}
            >
                <Form
                    title="auction-form"
                    form={form}
                    onFinish={(auction: Auction) => {
                        drawerState.auctionId
                            ? editAuctionSubmit(auction)
                            : addAuctionSubmit(auction)
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter auction name',
                            },
                        ]}
                    >
                        <Input placeholder="Please enter auction name" />
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
                        <DatePicker
                            showTime={true}
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
                        <DatePicker
                            showTime={true}
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

export default Auctions
