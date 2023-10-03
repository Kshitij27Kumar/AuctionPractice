import { test, expect, Locator } from '@playwright/test'
const { describe, beforeEach } = test

describe('Teams', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/teams')
    })

    const getRowContent = async (row: Locator) => {
        const cellLocators = await row.getByRole('cell').all()
        const cells = await Promise.all(cellLocators)
        const cellContents = cells.map(async (cell) => await cell.textContent())
        const rowContent = await Promise.all(cellContents)
        return rowContent
    }

    test('Should have the correct title', async ({ page }) => {
        //Given

        //Then
        await expect(page).toHaveTitle('Teams')
    })

    test('Should have only one search bar at the top', async ({ page }) => {
        //Given

        //When
        const searchBars = await page.getByPlaceholder('Search Team').all()

        //Then
        expect(searchBars).toHaveLength(1)
        await expect(searchBars[0]).toBeInViewport()
    })

    test('should have an add button', async ({ page }) => {
        //Given

        // When
        const addButton = page.getByRole('button', { name: 'Add Team' })

        // Then
        await expect(addButton).toBeVisible({ timeout: 500 })
    })

    test('Should have teams table', async ({ page }) => {
        // When
        const table = page.getByTestId('teams-table')

        // Then
        await expect(table).toBeVisible()
    })

    test('Should have a table with columns - id, team name and action', async ({
        page,
    }) => {
        //Given
        const expectedHeaders = ['Id', 'Team Name', 'Action']

        // When
        const columnHeaders = await page.getByRole('columnheader').all()
        const columnHeadersContent = await Promise.all(
            columnHeaders.map((header) => header.textContent())
        )

        // Then
        expect(columnHeadersContent).toEqual(expectedHeaders)
    })

    test('Should have some initial teams data on load', async ({ page }) => {
        // Given
        const expectedRows = [
            [],
            ['1', 'Mumbai Indians', 'EditDelete'],
            ['2', 'Chennai Super Kings', 'EditDelete'],
        ]

        await page.waitForSelector(
            '[data-testid=teams-table] td:nth-of-type(2)'
        )

        //When
        const rowPromises = page
            .getByTestId('teams-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        //Then
        expect(rowContent).toHaveLength(expectedRows.length)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should open a drawer when the add team button is clicked', async ({
        page,
    }) => {
        // Given
        const addTeamButton = page.getByRole('button', { name: 'Add Team' })
        const teamDrawer = page.getByTestId('add-team-drawer')

        // When
        await addTeamButton.click()

        // Then
        await expect(teamDrawer).toBeVisible({ timeout: 1000 })
    })

    test('should be able to add a team by submitting the form with valid information', async ({
        page,
    }) => {
        // Given
        const addTeamButton = page.getByRole('button', { name: 'Add Team' })
        const form = page.getByTitle('team-form')
        const teamName = page.getByPlaceholder('Enter team name')
        const submit = page.getByRole('button', { name: 'Submit' })

        // When
        await addTeamButton.click()
        await teamName.fill('Royal Challengers Bangalore')
        await submit.click()

        // Then
        await expect(form).toBeVisible({ timeout: 500 })
    })

    test('should be able to add a team and it should reflect in the table', async ({
        page,
    }) => {
        //Given
        const addTeamButton = page.getByRole('button', { name: 'Add Team' })
        const form = page.getByTitle('team-form')
        const teamName = form.getByPlaceholder('Enter team name')
        const submit = form.getByRole('button', { name: 'Submit' })

        const expectedRows = [
            [],
            ['1', 'Mumbai Indians', 'EditDelete'],
            ['2', 'Chennai Super Kings', 'EditDelete'],
            ['3', 'Royal Challenegers Bangalore', 'EditDelete'],
        ]

        //When
        await addTeamButton.click()
        await teamName.fill('Royal Challenegers Bangalore')
        await submit.click()

        const rowPromises = page
            .getByTestId('teams-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        //Then
        expect(rowContent).toHaveLength(4)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should show a confirmation popup on clicking delete button', async ({
        page,
    }) => {
        // Given
        await page.waitForSelector(
            '[data-testid=teams-table] td:nth-of-type(2)'
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

    test('should be able to delete a team and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const expectedRows = [[], ['1', 'Mumbai Indians', 'EditDelete']]
        await page.waitForSelector(
            '[data-testid=teams-table] td:nth-of-type(2)'
        )

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
        await deleteButtons[1].click()
        await deleteConfirmationButton.click()

        const rowPromises = page
            .getByTestId('teams-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    test('should be able to open drawer when edit button is clicked', async ({
        page,
    }) => {
        // Given
        const teamDrawer = page.getByTestId('add-team-drawer')
        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()

        await page.waitForSelector(
            '[data-testid=teams-table] td:nth-of-type(2)'
        )

        // When
        await editButtons[1].click()

        // Then
        await expect(teamDrawer).toBeVisible({ timeout: 1000 })
    })

    test('should be able to get the form with the pre-filled team name when clicked on edit ', async ({
        page,
    }) => {
        // Given
        const form = page.getByTitle('team-form')
        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()

        // When
        await editButtons[1].click()
        const teamName = await form
            .getByPlaceholder('Enter team name')
            .inputValue({ timeout: 1000 })

        // Then
        expect(teamName).toEqual('Chennai Super Kings')
    })

    test('should be able to reflect the updated change in the table ', async ({
        page,
    }) => {
        // Given
        const expectedRows = [
            [],
            ['1', 'Mumbai Indians', 'EditDelete'],
            ['2', 'CSK', 'EditDelete'],
        ]
        await page.waitForSelector(
            '[data-testid=teams-table] td:nth-of-type(2)'
        )
        const form = page.getByTitle('team-form')
        const teamName = form.getByPlaceholder('Enter team name')
        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()
        const submit = form.getByRole('button', { name: 'Submit' })

        // When
        await editButtons[1].click()
        await teamName.fill('CSK')
        await submit.click()

        const rowPromises = page
            .getByTestId('teams-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    test('should be able to delete newly created team', async ({ page }) => {
        //Given
        const addTeamButton = page.getByRole('button', { name: 'Add Team' })
        const form = page.getByTitle('team-form')
        const teamName = form.getByPlaceholder('Enter team name')
        const submit = form.getByRole('button', { name: 'Submit' })

        const expectedRows = [
            [],
            ['1', 'Mumbai Indians', 'EditDelete'],
            ['2', 'Chennai Super Kings', 'EditDelete'],
            // ['3', 'Royal Challenegers Bangalore', 'EditDelete'],
        ]

        //When
        await addTeamButton.click()
        await teamName.fill('Royal Challenegers Bangalore')
        await submit.click()

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
        await deleteButtons[2].click()
        await deleteConfirmationButton.click()

        const rowPromises = page
            .getByTestId('teams-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })
})
