import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { Entity, Player } from 'domains'
import PlayerList from './list'

describe('Player List', () => {
    // const getRowContent = async (row: Locator) => {
    //     const cellLocators = await row.getByRole('cell').all()
    //     const cells = await Promise.all(cellLocators)
    //     const cellContents = cells.map(async (cell) => await cell.textContent())
    //     const rowContent = await Promise.all(cellContents)
    //     return rowContent
    // }

    it('Should show table', () => {
        // Given
        render(
            <PlayerList
                players={[]}
                handleDelete={() => {}}
                handleEdit={() => {}}
            />
        )

        // When

        // Then
        expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('should show no data when empty players list is passed', () => {
        // Given
        const players: (Player & Entity)[] = []

        // When
        render(
            <PlayerList
                players={players}
                handleDelete={() => {}}
                handleEdit={() => {}}
            />
        )
        const table = screen.getByRole('table')
        const rows = table.getElementsByTagName('tr')
        const rowContent = Array.from(rows)[1].textContent
        // Then
        expect(rowContent).toEqual('No data')
    })

    it('should display the data passed in the prop', () => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
        ]

        // When
        render(
            <PlayerList
                players={players}
                handleDelete={() => {}}
                handleEdit={() => {}}
            />
        )
        const table = screen.getByRole('table')
        const rows = table.getElementsByTagName('tr')
        const rowContent = Array.from(rows)[1].textContent

        // Then
        expect(rowContent).toEqual('1RohitSharmaINDIAEditDelete')
    })

    it('should be able be delete a player', () => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
        ]

        const handleDelete = jest.fn()

        // When
        render(
            <PlayerList
                players={players}
                handleDelete={handleDelete}
                handleEdit={() => {}}
            />
        )
        const deleteButtons = screen.getAllByRole('button', {
            name: 'Delete',
        })

        fireEvent.click(deleteButtons[0])
        const deleteConfirmationButton = screen.getByRole('button', {
            name: 'OK',
        })
        fireEvent.click(deleteConfirmationButton)

        // Then
        expect(handleDelete).toHaveBeenCalledWith(1)
    })

    it('Should be able to call the edit function on click of an edit button', () => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
        ]

        const handleEdit = jest.fn()

        // When
        render(
            <PlayerList
                players={players}
                handleDelete={() => {}}
                handleEdit={handleEdit}
            />
        )
        const editButtons = screen.getAllByRole('button', {
            name: 'Edit',
        })

        fireEvent.click(editButtons[0])

        //Then
        expect(handleEdit).toHaveBeenCalledWith(1)
    })
})
