import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Entity, ObjectId, Player } from 'domains'

import { PlayerForm } from './form'
import { AddPlayerService, UpdatePlayerService } from '../../../services/player'

describe('Player Form', () => {
    it('should have three input fields: firstName, lastName and country', () => {
        // Given

        class TestPlayerService
            implements AddPlayerService, UpdatePlayerService
        {
            public addPlayer(player: Player): Promise<Player & Entity> {
                return Promise.resolve({
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'australia',
                })
            }

            public updatePlayer(
                id: ObjectId,
                player: Player
            ): Promise<Player & Entity> {
                return Promise.resolve({
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'india',
                })
            }
        }
        // When
        render(<PlayerForm service={new TestPlayerService()} />)
        const firstName = screen.getByTestId('player-firstname-input')
        const lastName = screen.getByTestId('player-lastname-input')
        const country = screen.getByTestId('player-country-select')

        // Then
        expect(firstName).toBeInTheDocument()
        expect(lastName).toBeInTheDocument()
        expect(country).toBeInTheDocument()
    })

    it('should have empty input fields if no player data is passed', () => {
        // Given
        render(<PlayerForm />)
        const firstName: HTMLInputElement = screen.getByTestId(
            'player-firstname-input'
        )
        const lastName: HTMLInputElement = screen.getByTestId(
            'player-lastname-input'
        )
        const country: HTMLSelectElement = screen.getByTestId(
            'player-country-select'
        )

        // When

        // Then
        expect(firstName.value).toEqual('')
        expect(lastName.value).toEqual('')
        expect(country.value).toEqual('')
    })

    it('should have pre-filled input fields if player data is passed', () => {
        // Given
        const player: Player & Entity = {
            id: 1,
            firstName: 'Virat',
            lastName: 'Kohli',
            country: 'india',
        }
        render(<PlayerForm defaultPlayer={player} />)

        const firstName: HTMLInputElement = screen.getByTestId(
            'player-firstname-input'
        )
        const lastName: HTMLInputElement = screen.getByTestId(
            'player-lastname-input'
        )
        const country: HTMLSelectElement = screen.getByTestId(
            'player-country-select'
        )

        // When

        // Then
        expect(firstName.value).toEqual(player.firstName)
        expect(lastName.value).toEqual(player.lastName)
        expect(country.value).toEqual(player.country)
    })

    it('should call onSuccess with a new player when form is submitted with no preset data', async () => {
        // Given

        const testPlayerService: AddPlayerService & UpdatePlayerService = {
            addPlayer(player: Player): Promise<Player & Entity> {
                return Promise.resolve({
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'india',
                })
            },
            updatePlayer(
                id: ObjectId,
                player: Player
            ): Promise<Player & Entity> {
                return Promise.resolve({
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'india',
                })
            },
        }

        const handler = jest.fn()
        const player = {
            id: 1,
            firstName: 'Rohit',
            lastName: 'Sharma',
            country: 'india',
        }

        render(<PlayerForm onSuccess={handler} service={testPlayerService} />)

        const firstNameInput = screen.getByTestId('player-firstname-input')
        const lastNameInput = screen.getByTestId('player-lastname-input')
        const countryInput = screen.getByTestId('player-country-select')

        // When
        fireEvent.change(firstNameInput, {
            target: { value: player.firstName },
        })
        fireEvent.change(lastNameInput, {
            target: { value: player.lastName },
        })
        fireEvent.change(countryInput, { target: { value: player.country } })
        fireEvent.click(screen.getByText('Submit'))

        // Then
        await waitFor(() => {
            expect(handler).toHaveBeenCalledWith(player)
        })
    })

    it('should call onSuccess with a updated player when form is submitted with preset data ', async () => {
        // Given
        class TestPlayerService
            implements AddPlayerService, UpdatePlayerService
        {
            public addPlayer(player: Player): Promise<Player & Entity> {
                return Promise.resolve({
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'australia',
                })
            }

            public updatePlayer(
                id: ObjectId,
                player: Player
            ): Promise<Player & Entity> {
                return Promise.resolve({
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'india',
                })
            }
        }

        const handler = jest.fn()
        const player = {
            id: 1,
            firstName: 'Rohit',
            lastName: 'Sharma',
            country: 'australia',
        }
        const updatedPlayer = {
            country: 'india',
        }

        render(
            <PlayerForm
                defaultPlayer={player}
                onSuccess={handler}
                service={new TestPlayerService()}
            />
        )

        const countryInput = screen.getByTestId('player-country-select')

        // When
        fireEvent.change(countryInput, {
            target: { value: updatedPlayer.country },
        })
        fireEvent.click(screen.getByText('Submit'))

        // Then
        await waitFor(() => {
            expect(handler).toHaveBeenCalledWith({
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'india',
            })
        })
    })
})
