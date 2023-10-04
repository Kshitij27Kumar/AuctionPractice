import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PlayerList from './list'

describe('Player List', () => {
    it('Should show empty table', () => {
        // Given
        render(<PlayerList />)

        // When

        // Then
        expect(screen.getByText('This is a list')).toBeInTheDocument()
    })
})
