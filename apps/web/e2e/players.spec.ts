import { test, expect, Locator } from '@playwright/test'
import { Entity, Player } from 'domains'
const { describe } = test

describe('Players', () => {
    const getRowContent = async (row: Locator) => {
        const cellLocators = await row.getByRole('cell').all()
        const cells = await Promise.all(cellLocators)
        const cellContents = cells.map(async (cell) => await cell.textContent())
        const rowContent = await Promise.all(cellContents)
        return rowContent
    }

    test('Should have the correct title', async ({ page }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        // Then
        await expect(page).toHaveTitle('Players')
    })

    test('Should have only one search bar at the top', async ({ page }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        // When
        const searchBars = await page.getByPlaceholder('Search Player').all()

        // Then
        expect(searchBars).toHaveLength(1)
        await expect(searchBars[0]).toBeInViewport()
    })

    test('should have an add button', async ({ page }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        // When
        const addButton = page.getByRole('button', { name: 'Add Player' })

        // Then
        await expect(addButton).toBeVisible({ timeout: 500 })
    })

    test('Should have a players table', async ({ page }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        // When
        const table = page.getByTestId('players-table')

        // Then
        await expect(table).toBeVisible({ timeout: 500 })
    })

    test('Should have a table with columns - id, first name, last name, country and action buttons', async ({
        page,
    }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        const expectedHeaders = [
            'Id',
            'First Name',
            'Last Name',
            'Country',
            'Action',
        ]
        // When

        // Getting the array of locators with role columnheader
        const columnHeaders = await page.getByRole('columnheader').all()
        // We are resolving the array of above promises
        const columnHeadersContent = await Promise.all(
            columnHeaders.map((header) => header.textContent())
        )

        // Then
        expect(columnHeadersContent).toEqual(expectedHeaders)
    })

    test('Should display an empty table when there is no data', async ({
        page,
    }) => {
        // Given
        await page.route('**/*/api/players', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: [],
            })
        })

        await page.goto('http://localhost:3000/players')

        const expectedRows = [[], ['No data']]

        await page.waitForSelector(
            '[data-testid=players-table] td:nth-of-type(1)'
        )

        // When
        const rowPromises = page
            .getByTestId('players-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toHaveLength(expectedRows.length)
        expect(rowContent).toEqual(expectedRows)
    })

    test('Should display data in the table ', async ({ page }) => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
        ]

        await page.route('**/*/api/players', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: players,
            })
        })

        await page.goto('http://localhost:3000/players')

        const expectedRows = [
            [],
            ['1', 'Rohit', 'Sharma', 'INDIA', 'EditDelete'],
        ]

        await page.waitForSelector(
            '[data-testid=players-table] td:nth-of-type(1)'
        )

        // When
        const rowPromises = page
            .getByTestId('players-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toHaveLength(expectedRows.length)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should display an alert when server is unavailable', async ({
        page,
    }) => {
        // Given
        await page.route('**/*/api/players', async (route) => {
            await route.fulfill({ status: 500 })
        })

        await page.goto('http://localhost:3000/players')

        // When
        const notification = page.getByTestId('player-error')
        const text = await notification.textContent()

        // Then
        await expect(notification).toBeVisible()
        expect(text).toEqual('ErrorSomething went wrong. Please try again.')
    })

    test('should open a drawer when the add player button is clicked', async ({
        page,
    }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        const addPlayerButton = page.getByRole('button', { name: 'Add Player' })
        const playerDrawer = page.getByTestId('add-player-drawer')

        // When
        await addPlayerButton.click()

        // Then
        await expect(playerDrawer).toBeVisible()
    })

    test('should be able to add a player by submitting the form with valid information', async ({
        page,
    }) => {
        // Given
        await page.goto('http://localhost:3000/players')

        const addPlayerButton = page.getByRole('button', { name: 'Add Player' })
        const form = page.getByTitle('player-form')
        const firstName = page.getByPlaceholder('Please enter first name')
        const lastName = page.getByPlaceholder('Please enter last name')
        const country = page.getByRole('combobox')
        const submit = page.getByRole('button', { name: 'Submit' })

        // When
        await addPlayerButton.click()
        await firstName.fill('Shubman')
        await lastName.fill('Gill')
        await country.selectOption('india')
        await submit.click()

        // Then
        await expect(form).toBeVisible({ timeout: 500 })
        // TODO: await expect(form).not.toBeVisible({ timeout: 500 })
    })

    test('should be able to add a player and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Dale',
                lastName: 'Steyn',
                country: 'South Africa',
            },
        ]
        await page.route('**/*/api/players', async (route, request) => {
            if (request.method() == 'POST') {
                await route.fulfill({ status: 201, json: players })
            } else if (request.method() == 'GET') {
                await route.fulfill({ status: 200, json: players })
            }
        })

        await page.goto('http://localhost:3000/players')

        const addPlayerButton = page.getByRole('button', { name: 'Add Player' })
        const form = page.getByTitle('player-form')
        const firstName = form.getByPlaceholder('Please enter first name')
        const lastName = form.getByPlaceholder('Please enter last name')
        const country = form.getByRole('combobox')
        const submit = form.getByRole('button', { name: 'Submit' })

        const expectedRows = [
            [],
            ['1', 'Dale', 'Steyn', 'SOUTH AFRICA', 'EditDelete'],
        ]

        // When
        await addPlayerButton.click()
        await firstName.fill('Dale')
        await lastName.fill('Steyn')
        await country.selectOption('south africa')
        await submit.click()

        const rowPromises = page
            .getByTestId('players-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toHaveLength(expectedRows.length)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should not be able to add a player when there are missing properties', async ({
        page,
    }) => {
        // Given
        await page.route('**/*/api/players', async (route, request) => {
            const error = {
                message: 'invalid input',
            }
            if (request.method() == 'POST') {
                await route.fulfill({ status: 400, json: error })
            }
        })

        await page.goto('http://localhost:3000/players')

        const addPlayerButton = page.getByRole('button', { name: 'Add Player' })
        const form = page.getByTitle('player-form')
        const firstName = form.getByPlaceholder('Please enter first name')
        const lastName = form.getByPlaceholder('Please enter last name')
        const country = form.getByRole('combobox')
        const submit = form.getByRole('button', { name: 'Submit' })

        // When
        await addPlayerButton.click()
        await firstName.fill('Dale')
        await lastName.fill('Steyn')
        await country.selectOption('south africa')
        await submit.click()

        // When
        const notification = page.getByTestId('player-error')
        const text = await notification.textContent()

        // Then
        await expect(notification).toBeVisible()
        expect(text).toEqual('ErrorSomething went wrong. Please try again.')
    })

    test('should show a confirmation popup on clicking delete button', async ({
        page,
    }) => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
        ]

        await page.route('**/*/api/players', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                json: players,
            })
        })

        await page.goto('http://localhost:3000/players')

        await page.waitForSelector(
            '[data-testid=players-table] td:nth-of-type(1)'
        )

        const deleteButtons = await page
            .getByRole('button', {
                name: 'Delete',
            })
            .all()

        const deletePopUp = page.getByRole('tooltip', {
            name: 'Are you sure?',
        })

        // When
        await deleteButtons[0].click({ timeout: 500 })

        // Then
        await expect(deletePopUp).toBeVisible()
    })

    test('should be able to delete a player and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
            {
                id: 2,
                firstName: 'MS',
                lastName: 'Dhoni',
                country: 'India',
            },
        ]

        let requestNumber = 0

        await page.route('**/*/api/players', async (route) => {
            if (requestNumber === 0) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: players,
                })
            } else if (requestNumber === 1) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: [players[0]],
                })
            }
        })

        await page.route('**/*/api/players/*', async (route, request) => {
            if (request.method() === 'DELETE') {
                await route.fulfill({
                    status: 204,
                })
            }
        })

        await page.goto('http://localhost:3000/players')

        await page.waitForSelector(
            '[data-testid=players-table] td:nth-of-type(2)'
        )

        const expectedRows = [
            [],
            ['1', 'Rohit', 'Sharma', 'INDIA', 'EditDelete'],
        ]

        const deleteButtons = await page
            .getByRole('button', {
                name: 'Delete',
            })
            .all()
        const deleteConfirmationButton = page
            .getByRole('tooltip', {
                name: 'Are you sure?',
            })
            .getByRole('button', { name: 'OK' })

        // When
        requestNumber++
        await deleteButtons[1].click({ timeout: 500 })
        await deleteConfirmationButton.click()

        const rowPromises = page
            .getByTestId('players-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    test('should be able to edit a player and it should reflect in table', async ({
        page,
    }) => {
        // Given
        const players: (Player & Entity)[] = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Sharma',
                country: 'India',
            },
        ]

        const updatedPlayer = [
            {
                id: 1,
                firstName: 'Rohit',
                lastName: 'Verma',
                country: 'India',
            },
        ]

        let requestNumber = 0

        await page.route('**/*/api/players', async (route) => {
            if (requestNumber === 0) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: players,
                })
            } else if (requestNumber === 1) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: updatedPlayer,
                })
            }
        })

        await page.route('**/*/api/players/*', async (route, request) => {
            if (request.method() === 'PATCH') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    json: updatedPlayer,
                })
            }
        })

        await page.goto('http://localhost:3000/players')

        await page.waitForSelector(
            '[data-testid=players-table] td:nth-of-type(1)'
        )

        const form = page.getByTitle('player-form')
        const firstName = form.getByPlaceholder('Please enter first name')
        const lastName = form.getByPlaceholder('Please enter last name')
        const country = form.getByRole('combobox')
        const submit = form.getByRole('button', { name: 'Submit' })

        const expectedRows = [
            [],
            ['1', 'Rohit', 'Verma', 'INDIA', 'EditDelete'],
        ]

        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()

        await editButtons[0].click()

        await firstName.click()
        await firstName.fill('Rohit')

        await lastName.click()
        await lastName.fill('Verma')

        await country.selectOption('india')

        requestNumber++
        await submit.click()

        const rowPromises = page
            .getByTestId('players-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // When

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    // test('should delete the newly added player', async ({ page }) => {
    //     // Given
    //     await page.waitForSelector(
    //         '[data-testid=players-table] td:nth-of-type(2)'
    //     )
    //     const addPlayerButton = page.getByRole('button', { name: 'Add Player' })
    //     const form = page.getByTitle('player-form')
    //     const firstName = form.getByPlaceholder('Please enter first name')
    //     const lastName = form.getByPlaceholder('Please enter last name')
    //     const country = form.getByRole('combobox')
    //     const submit = form.getByRole('button', { name: 'Submit' })

    //     const expectedRows = [
    //         [],
    //         ['1', 'Rohit', 'Sharma', 'INDIA', 'EditDelete'],
    //         ['2', 'Matthew', 'Wade', 'AUSTRALIA', 'EditDelete'],
    //         // ['3', 'Dale', 'Steyn', 'SOUTH AFRICA', 'EditDelete'],
    //     ]

    //     // When
    //     await addPlayerButton.click()
    //     await firstName.fill('Dale')
    //     await lastName.fill('Steyn')
    //     await country.selectOption('south africa')
    //     await submit.click()

    //     const deleteButtons = await page
    //         .getByRole('button', {
    //             name: 'Delete',
    //         })
    //         .all()
    //     const deleteConfirmationButton = page
    //         .getByRole('tooltip', {
    //             name: 'Are you sure?',
    //         })
    //         .getByRole('button', { name: 'OK' })

    //     // When
    //     await deleteButtons[2].click({ timeout: 500 })
    //     await deleteConfirmationButton.click()

    //     const rowPromises = page
    //         .getByTestId('players-table')
    //         .getByRole('row')
    //         .all()
    //     const rows = await Promise.all(await rowPromises)
    //     const rowContent = await Promise.all(rows.map(getRowContent))

    //     // Then
    //     expect(rowContent).toEqual(expectedRows)
    // })
})
