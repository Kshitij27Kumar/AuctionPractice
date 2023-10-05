import { test, expect, Locator } from '@playwright/test'
const { describe, beforeEach } = test

const getRowContent = async (row: Locator) => {
    const cellLocators = await row.getByRole('cell').all()
    const cells = await Promise.all(cellLocators)
    const cellContents = cells.map(async (cell) => await cell.textContent())
    const rowContent = await Promise.all(cellContents)
    return rowContent
}

describe('Seasons', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/seasons')
    })

    test('Should have the correct title', async ({ page }) => {
        //Given

        //Then
        await expect(page).toHaveTitle('Seasons')
    })

    test('Should have only one search bar at the top', async ({ page }) => {
        //Given

        //When
        const searchBars = await page.getByPlaceholder('Search Season').all()

        //Then
        expect(searchBars).toHaveLength(1)
        await expect(searchBars[0]).toBeInViewport()
    })

    test('should have an add button', async ({ page }) => {
        //Given

        // When
        const addButton = page.getByRole('button', { name: 'Add Season' })

        // Then
        await expect(addButton).toBeVisible({ timeout: 500 })
    })

    test('Should have a seasons table', async ({ page }) => {
        // When
        const table = page.getByTestId('seasons-table')

        // Then
        await expect(table).toBeVisible({ timeout: 500 })
    })

    test('Should have a table with columns - id, season name, start Date, end Date', async ({
        page,
    }) => {
        //Given
        const expectedHeaders = [
            'Id',
            'Season Name',
            'Start Date',
            'End Date',
            'Actions',
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

    test('Should have some initial player data on load', async ({ page }) => {
        // Given
        const startDate1 = new Date('2008-04-01').toDateString()
        const endDate1 = new Date('2008-05-27').toDateString()
        const startDate2 = new Date('2023-04-05').toDateString()
        const endDate2 = new Date('2023-06-02').toDateString()
        const expectedRows = [
            [],
            ['1', 'IPL 2008', startDate1, endDate1, 'EditDelete'],
            ['2', 'IPL 2023', startDate2, endDate2, 'EditDelete'],
        ]
        await page.waitForSelector(
            '[data-testid=seasons-table] td:nth-of-type(2)'
        )
        //When
        const rowPromises = page
            .getByTestId('seasons-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        //Then
        expect(rowContent).toHaveLength(3)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should open a drawer when the add season button is clicked', async ({
        page,
    }) => {
        // Given
        const addSeasonButton = page.getByRole('button', { name: 'Add Season' })
        const seasonDrawer = page.getByTestId('add-season-drawer')

        // When
        await addSeasonButton.click()

        // Then
        await expect(seasonDrawer).toBeVisible()
    })

    test('should be able to add a season by submitting the form with valid information', async ({
        page,
    }) => {
        // Given
        const addSeasonButton = page.getByRole('button', { name: 'Add Season' })
        const form = page.getByTitle('season-form')
        const name = form.getByTestId('seasonName')
        const startDate = form.getByTestId('startDate')
        const endDate = form.getByTestId('endDate')

        const submit = page.getByRole('button', { name: 'Submit' })

        // When
        await page.waitForTimeout(3000)
        await addSeasonButton.click({ timeout: 1000 })
        await name.fill('IPL 2024', { timeout: 2000 })
        await startDate.click()
        await startDate.fill('2024-04-04')
        await page.keyboard.press('Enter')
        await endDate.click()
        await endDate.fill('2024-05-24')
        await page.keyboard.press('Enter')
        await submit.click()

        // Then
        await expect(form).not.toBeVisible({ timeout: 500 })
    })

    test('should be able to add a season and it should reflect in the table', async ({
        page,
    }) => {
        //Given
        const addSeasonButton = page.getByRole('button', { name: 'Add Season' })
        const form = page.getByTitle('season-form')
        const name = form.getByPlaceholder('Please enter season name')
        const startDateSelector = form.getByTestId('startDate')
        const endDateSelector = form.getByTestId('endDate')
        const submit = form.getByRole('button', { name: 'Submit' })

        const startDate1 = new Date('2008-04-01').toDateString()
        const endDate1 = new Date('2008-05-27').toDateString()
        const startDate2 = new Date('2023-04-05').toDateString()
        const endDate2 = new Date('2023-06-02').toDateString()
        const startDate3 = new Date('2024-04-04').toDateString()
        const endDate3 = new Date('2024-05-24').toDateString()
        const expectedRows = [
            [],
            ['1', 'IPL 2008', startDate1, endDate1, 'EditDelete'],
            ['2', 'IPL 2023', startDate2, endDate2, 'EditDelete'],
            ['3', 'IPL 2024', startDate3, endDate3, 'EditDelete'],
        ]

        //When
        await page.waitForTimeout(3000)
        await addSeasonButton.click({ timeout: 1000 })
        await name.fill('IPL 2024', { timeout: 2000 })
        await startDateSelector.click()
        await startDateSelector.fill('2024-04-04')
        await page.keyboard.press('Enter')
        await endDateSelector.click()
        await endDateSelector.fill('2024-05-24')
        await page.keyboard.press('Enter')
        await submit.click()

        const rowPromises = page
            .getByTestId('seasons-table')
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

    test('should be able to delete a season and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const startDate1 = new Date('2008-04-01').toDateString()
        const endDate1 = new Date('2008-05-27').toDateString()
        const startDate2 = new Date('2023-04-05').toDateString()
        const endDate2 = new Date('2023-06-02').toDateString()
        const expectedRows = [
            [],
            ['1', 'IPL 2008', startDate1, endDate1, 'EditDelete'],
            // ['2', 'IPL 2023', startDate2, endDate2, 'EditDelete'],
        ]
        await page.waitForSelector(
            '[data-testid=seasons-table] td:nth-of-type(2)'
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
        await deleteButtons[1].click({ timeout: 500 })
        await deleteConfirmationButton.click()

        const rowPromises = page
            .getByTestId('seasons-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    test('should be able to update a season and it should reflect on the table', async ({
        page,
    }) => {
        // Given
        const startDate1 = new Date('2008-04-01').toDateString()
        const endDate1 = new Date('2008-05-27').toDateString()
        const startDate2 = new Date('2024-04-04').toDateString()
        const endDate2 = new Date('2024-05-24').toDateString()
        const expectedRows = [
            [],
            ['1', 'IPL 2008', startDate1, endDate1, 'EditDelete'],
            ['2', 'IPL 2024', startDate2, endDate2, 'EditDelete'],
        ]

        const form = page.getByTitle('season-form')
        const name = form.getByTestId('seasonName')
        const startDateSelector = form.getByTestId('startDate')
        const endDateSelector = form.getByTestId('endDate')
        const submit = form.getByRole('button', { name: 'Submit' })
        await page.waitForSelector(
            '[data-testid=seasons-table] td:nth-of-type(2)'
        )

        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()

        // When
        await editButtons[1].click({ timeout: 500 })

        await page.waitForTimeout(3000)

        await name.fill('IPL 2024', { timeout: 2000 })
        await startDateSelector.click()
        await startDateSelector.fill('2024-04-04')
        await page.keyboard.press('Enter')
        await endDateSelector.click()
        await endDateSelector.fill('2024-05-24')
        await page.keyboard.press('Enter')
        await submit.click()

        const rowPromises = page
            .getByTestId('seasons-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    test('should be able to delete the newly created season', async ({
        page,
    }) => {
        //Given
        const addSeasonButton = page.getByRole('button', { name: 'Add Season' })
        const form = page.getByTitle('season-form')
        const name = form.getByPlaceholder('Please enter season name')
        const startDateSelector = form.getByTestId('startDate')
        const endDateSelector = form.getByTestId('endDate')
        const submit = form.getByRole('button', { name: 'Submit' })

        const startDate1 = new Date('2008-04-01').toDateString()
        const endDate1 = new Date('2008-05-27').toDateString()
        const startDate2 = new Date('2023-04-05').toDateString()
        const endDate2 = new Date('2023-06-02').toDateString()
        const startDate3 = new Date('2024-04-04').toDateString()
        const endDate3 = new Date('2024-05-24').toDateString()
        const expectedRows = [
            [],
            ['1', 'IPL 2008', startDate1, endDate1, 'EditDelete'],
            ['2', 'IPL 2023', startDate2, endDate2, 'EditDelete'],
            // ['3', 'IPL 2024', startDate3, endDate3, 'EditDelete'],
        ]

        //When
        await page.waitForTimeout(3000)
        await addSeasonButton.click({ timeout: 1000 })
        await name.fill('IPL 2024', { timeout: 2000 })
        await startDateSelector.click()
        await startDateSelector.fill('2024-04-04')
        await page.keyboard.press('Enter')
        await endDateSelector.click()
        await endDateSelector.fill('2024-05-24')
        await page.keyboard.press('Enter')
        await submit.click()

        await page.waitForSelector(
            '[data-testid=seasons-table] td:nth-of-type(2)'
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
        await deleteButtons[2].click({ timeout: 500 })
        await deleteConfirmationButton.click()

        const rowPromises = page
            .getByTestId('seasons-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })
})
