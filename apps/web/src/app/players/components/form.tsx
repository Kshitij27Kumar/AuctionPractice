import { Button, Form, Input, Space } from 'antd'
import { Entity, Player } from 'domains'
import { useEffect } from 'react'
import { AddPlayerService, UpdatePlayerService } from '../../../services/player'
import { withPlayerService } from '../../shared/hoc'

interface PlayerFormProps {
    defaultPlayer?: Player & Entity
    onSuccess?: (player: Player) => void
    onFailure?: (error: Error) => void
    service: AddPlayerService & UpdatePlayerService
}

export const PlayerForm = ({
    defaultPlayer,
    onSuccess,
    onFailure,
    service,
}: PlayerFormProps) => {
    const [form] = Form.useForm()

    const setFormFields = (player: (Player & Entity) | undefined) => {
        if (player) {
            form.setFieldsValue(player)
        } else {
            form.resetFields()
        }
    }

    const addPlayerSubmit = async (player: Player) => {
        try {
            const newPlayer = await service.addPlayer(player)
            if (onSuccess) {
                onSuccess(newPlayer)
            }
        } catch (error) {
            if (onFailure) {
                onFailure(error as Error)
            }
        }
    }

    const editPlayerSubmit = async (player: Player) => {
        try {
            const editedPlayer = await service.updatePlayer(
                defaultPlayer!.id,
                player
            )
            if (onSuccess) {
                onSuccess(editedPlayer)
            }
        } catch (error) {
            if (onFailure) {
                onFailure(error as Error)
            }
        }
    }

    useEffect(() => {
        setFormFields(defaultPlayer)
    }, [])

    return (
        <Form
            title="player-form"
            initialValues={{
                firstName: '',
                lastName: '',
                country: '',
            }}
            form={form}
            onFinish={(player: Player) => {
                defaultPlayer?.id
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
                <Input
                    placeholder="Please enter first name"
                    data-testid="player-firstname-input"
                />
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
                <Input
                    placeholder="Please enter last name"
                    data-testid="player-lastname-input"
                />
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
                <select
                    className="ant-col ant-form-item-control ant-form-item-control-input ant-form-item-control-input-content"
                    data-testid="player-country-select"
                >
                    <option value="">-- select an option --</option>
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
    )
}

export default withPlayerService(PlayerForm)
