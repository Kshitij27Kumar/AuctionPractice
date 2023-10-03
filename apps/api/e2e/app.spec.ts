const PORT = 3001
const BASE_URL = `http://localhost:${PORT}`

describe('Base URL', () => {
    it('should get hello world when I do a GET on base url', async () => {
        //Given
        const response = await fetch(BASE_URL, {
            method: 'GET',
        })

        //When
        const content = await response.text()

        //Then
        expect(content).toEqual('<h1>Hello World</h1>')
    })

    describe('Players', () => {
        const ENDPOINT = `${BASE_URL}/players`

        test('should get the list of players when we do GET on /players', async () => {
            // Given
            const response = await fetch(ENDPOINT, {
                method: 'GET',
            })
            const expectedPlayers = [
                {
                    id: 1,
                    firstName: 'Rohit',
                    lastName: 'Sharma',
                    country: 'INDIA',
                },
                {
                    id: 2,
                    firstName: 'Matthew',
                    lastName: 'Wade',
                    country: 'AUSTRALIA',
                },
            ]

            // When
            const players = await response.json()

            // Then
            expect(players).toEqual(expectedPlayers)
        })

        test('should be able to get player by id', async () => {
            // Given

            const response = await fetch(`${ENDPOINT}/1`, {
                method: 'GET',
            })
            const expectedPlayer = {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'INDIA',
            }

            // When
            const player = await response.json()

            // Then
            expect(player).toEqual(expectedPlayer)
        })

        test('should get a 404 HTTP error when a player with specified id does not exist', async () => {
            // Given
            const expectedStatus = 404
            const response = await fetch(`${ENDPOINT}/0`, {
                method: 'GET',
            })

            // When
            const status = response.status

            // Then
            expect(status).toEqual(expectedStatus)
        })

        test('should be able to add a player', async () => {
            // Given
            const expectedStatus = 201
            const player = {
                firstName: 'MS',
                lastName: 'Dhoni',
                country: 'INDIA',
            }

            const expectedPlayer = {
                id: 1,
                firstName: 'MS',
                lastName: 'Dhoni',
                country: 'INDIA',
            }

            const response = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(player),
            })

            // When
            const status = response.status
            const playerResponse = await response.json()

            // Then
            expect(status).toEqual(expectedStatus)
            expect(playerResponse).toEqual(expectedPlayer)
        })

        // test('should be able to add multiple players', async () => {
        //     // Given
        //     const expectedStatus = 201
        //     const players = [
        //         {
        //             firstName: 'Rohit',
        //             lastName: 'Sharma',
        //             country: 'INDIA',
        //         },
        //         {
        //             firstName: 'Matthew',
        //             lastName: 'Wade',
        //             country: 'AUSTRALIA',
        //         },
        //     ]
        //     const expectedPlayers = [
        //         {
        //             id: 1,
        //             firstName: 'Rohit',
        //             lastName: 'Sharma',
        //             country: 'INDIA',
        //         },
        //         {
        //             id: 2,
        //             firstName: 'Matthew',
        //             lastName: 'Wade',
        //             country: 'AUSTRALIA',
        //         },
        //     ]

        //     await fetch(ENDPOINT, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(players[0]),
        //     })

        //     const response2 = await fetch(ENDPOINT, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(players[1]),
        //     })

        //     // When
        //     const status = response2.status
        //     const playerResponse = await response2.json()
        //     const { id } = playerResponse

        //     // Then
        //     expect(status).toEqual(expectedStatus)
        //     expect(playerResponse).toEqual({ ...expectedPlayers[1], id })
        // })
    })
})
