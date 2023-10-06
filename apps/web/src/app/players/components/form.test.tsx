import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Entity, Player } from 'domains'

import PlayerForm from './form'
import { addPlayer, updatePlayer } from '../../../services/player'

describe('Player Form', () => {
    test('should have three input fields: firstName, lastName and country', () => {
        // Given

        // When
        render(<PlayerForm addPlayer={addPlayer} updatePlayer={updatePlayer} />)
        const firstName = screen.getByTestId('player-firstname-input')
        const lastName = screen.getByTestId('player-lastname-input')
        const country = screen.getByTestId('player-country-select')

        // Then
        expect(firstName).toBeInTheDocument()
        expect(lastName).toBeInTheDocument()
        expect(country).toBeInTheDocument()
    })

    test('should have empty input fields if no player data is passed', () => {
        // Given
        render(<PlayerForm addPlayer={addPlayer} updatePlayer={updatePlayer} />)
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
        expect(country.value).toEqual('-- select an option --')
    })

    test('should have pre-filled input fields if player data is passed', () => {
        // Given
        const player: Player & Entity = {
            id: 1,
            firstName: 'Virat',
            lastName: 'Kohli',
            country: 'india',
        }
        render(
            <PlayerForm
                defaultPlayer={player}
                addPlayer={addPlayer}
                updatePlayer={updatePlayer}
            />
        )
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

    test('should call onFinish with a new player when form is submitted with no preset data', () => {
        // Given
        const handler = jest.fn()
        const player = {
            id: 1,
            firstName: 'Rohit',
            lastName: 'Sharma',
            country: 'india',
        }

        render(
            <PlayerForm
                onFinish={handler}
                addPlayer={addPlayer}
                updatePlayer={updatePlayer}
            />
        )
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
        expect(handler).toHaveBeenCalledWith(player)
    })
})
