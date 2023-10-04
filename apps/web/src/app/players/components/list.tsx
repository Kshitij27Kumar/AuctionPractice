import { Button, Popconfirm, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Entity, ObjectId, Player } from 'domains'

interface ListProps {
    players: (Player & Entity)[]
    handleDelete(id: ObjectId): void
    handleEdit(id: ObjectId): void
}

const List = ({
    players,
    handleDelete: onDeleteClick,
    handleEdit: onEditClick,
}: ListProps) => {
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
                        onConfirm={() => onDeleteClick(id)}
                    >
                        <Button danger={true}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <Table
            columns={columns}
            dataSource={players}
            data-testid="players-table"
        ></Table>
    )
}

export default List
