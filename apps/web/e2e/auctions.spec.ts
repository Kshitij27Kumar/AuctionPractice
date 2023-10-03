import { test, expect, Locator } from '@playwright/test'
const { describe, beforeEach } = test

describe('Auctions', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/auctions')
    })

    const getRowContent = async (row: Locator) => {
        const cellLocators = await row.getByRole('cell').all()
        const cells = await Promise.all(cellLocators)
        const cellContents = cells.map(async (cell) => await cell.textContent())
        const rowContent = await Promise.all(cellContents)
        return rowContent
    }

    test('should have the correct title', async ({ page }) => {
        // Given
        // When

        // Then
        await expect(page).toHaveTitle('Auctions')
    })

    test('should have only one search bar at the top', async ({ page }) => {
        // Given

        // When
        const searchBars = await page.getByPlaceholder('Search Auction').all()

        // Then
        expect(searchBars).toHaveLength(1)
        await expect(searchBars[0]).toBeInViewport()
    })

    test('should have an add button', async ({ page }) => {
        // Given

        // When
        const addButton = page.getByRole('button', { name: 'Add Auction' })

        // Then
        await expect(addButton).toBeVisible({ timeout: 500 })
    })

    test('should have a auctions table', async ({ page }) => {
        // When
        const table = page.getByTestId('auctions-table')

        // Then
        await expect(table).toBeVisible({ timeout: 500 })
    })

    test('should have a table with columns - id, auction name, start date, end date and action buttons', async ({
        page,
    }) => {
        // Given
        const expectedHeaders = [
            'Id',
            'Auction Name',
            'Start Date',
            'End Date',
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

    test('should have some initial auction data on load', async ({ page }) => {
        // Given
        const expectedRows = [
            [],
            ['1', 'IPL 1', 'Fri Sep 01 2023', 'Sat Sep 02 2023', 'EditDelete'],
            ['2', 'IPL 2', 'Sun Oct 01 2023', 'Mon Oct 02 2023', 'EditDelete'],
        ]

        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
        )
        // When
        const rowPromises = page
            .getByTestId('auctions-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then

        expect(rowContent).toHaveLength(expectedRows.length)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should open a drawer when the add auction button is clicked', async ({
        page,
    }) => {
        // Given
        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
        )
        const addAuctionButton = page.getByRole('button', {
            name: 'Add Auction',
        })
        const auctionDrawer = page.getByTestId('add-auction-drawer')

        // When
        await addAuctionButton.click({ timeout: 500 })

        // Then
        await expect(auctionDrawer).toBeVisible()
    })

    test('should be able to add an auction by submitting the form with valid information', async ({
        page,
    }) => {
        // Given
        const addAuctionButton = page.getByRole('button', {
            name: 'Add Auction',
        })
        const form = page.getByTitle('auction-form')
        const name = form.getByPlaceholder('Please enter auction name')
        const startDate = form.getByTestId('startDate')
        const endDate = form.getByTestId('endDate')
        const submit = page.getByRole('button', { name: 'Submit' })

        // When
        await addAuctionButton.click()
        await name.fill('IPL 3')

        await startDate.click()
        await startDate.fill('2023-11-10 14:00:00')
        await page.keyboard.press('Enter')

        await endDate.click()
        await endDate.fill('2023-11-11 16:00:00')
        await page.keyboard.press('Enter')

        await submit.click()

        // Then
        await expect(form).not.toBeVisible({ timeout: 500 })
    })

    test('should be able to add an auction and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const addAuctionButton = page.getByRole('button', {
            name: 'Add Auction',
        })

        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
        )
        const form = page.getByTitle('auction-form')
        const name = form.getByPlaceholder('Please enter auction name')
        const startDate = form.getByTestId('startDate')
        const endDate = form.getByTestId('endDate')
        const submit = page.getByRole('button', { name: 'Submit' })

        const expectedRows = [
            [],
            ['1', 'IPL 1', 'Fri Sep 01 2023', 'Sat Sep 02 2023', 'EditDelete'],
            ['2', 'IPL 2', 'Sun Oct 01 2023', 'Mon Oct 02 2023', 'EditDelete'],
            ['3', 'IPL 3', 'Tue Nov 07 2023', 'Wed Nov 08 2023', 'EditDelete'],
        ]

        // When
        await addAuctionButton.click()
        await name.fill('IPL 3')

        await startDate.click()
        await startDate.fill('2023-11-07 13:00:00')
        await page.keyboard.press('Enter')

        await endDate.click()
        await endDate.fill('2023-11-08 16:00:00')
        await page.keyboard.press('Enter')

        await submit.click()

        const rowPromises = page
            .getByTestId('auctions-table')
            .getByRole('row')
            .all()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toHaveLength(expectedRows.length)
        expect(rowContent).toEqual(expectedRows)
    })

    test('should show a confirmation popup on clicking delete button', async ({
        page,
    }) => {
        // Given
        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
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

    test('should be able to delete an auction and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const expectedRows = [
            [],
            ['1', 'IPL 1', 'Fri Sep 01 2023', 'Sat Sep 02 2023', 'EditDelete'],
        ]

        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
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
            .getByTestId('auctions-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })

    test('should open a drawer when the edit button is clicked', async ({
        page,
    }) => {
        // Given
        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()

        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
        )
        const auctionDrawer = page.getByTestId('add-auction-drawer')

        // When
        await editButtons[1].click({ timeout: 500 })

        // Then
        await expect(auctionDrawer).toBeVisible()
    })

    test('should be able to edit an auction and it should reflect in the table', async ({
        page,
    }) => {
        // Given
        const expectedRows = [
            [],
            ['1', 'IPL 1', 'Fri Sep 01 2023', 'Sat Sep 02 2023', 'EditDelete'],
            ['2', 'IPL 2', 'Sun Oct 01 2023', 'Mon Oct 02 2023', 'EditDelete'],
        ]
        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
        )
        const editButtons = await page
            .getByRole('button', {
                name: 'Edit',
            })
            .all()

        const auctionDrawer = page.getByTestId('add-auction-drawer')
        const name = page.getByPlaceholder('Please enter auction name')
        const submit = page.getByRole('button', { name: 'Submit' })
        const rowPromises = page
            .getByTestId('auctions-table')
            .getByRole('row')
            .all()

        // When
        await editButtons[1].click({ timeout: 500 })
        await name.fill('IPL 2')
        await submit.click()

        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        await expect(auctionDrawer).not.toBeVisible({ timeout: 500 })
        expect(rowContent).toEqual(expectedRows)
    })

    test('should be able to delete newly created auction', async ({ page }) => {
        // Given
        const addAuctionButton = page.getByRole('button', {
            name: 'Add Auction',
        })

        await page.waitForSelector(
            '[data-testid=auctions-table] td:nth-of-type(2)'
        )
        const form = page.getByTitle('auction-form')
        const name = form.getByPlaceholder('Please enter auction name')
        const startDate = form.getByTestId('startDate')
        const endDate = form.getByTestId('endDate')
        const submit = page.getByRole('button', { name: 'Submit' })

        const expectedRows = [
            [],
            ['1', 'IPL 1', 'Fri Sep 01 2023', 'Sat Sep 02 2023', 'EditDelete'],
            ['2', 'IPL 2', 'Sun Oct 01 2023', 'Mon Oct 02 2023', 'EditDelete'],
        ]

        // When
        await addAuctionButton.click()
        await name.fill('IPL 3')

        await startDate.click()
        await startDate.fill('2023-11-07 13:00:00')
        await page.keyboard.press('Enter')

        await endDate.click()
        await endDate.fill('2023-11-08 16:00:00')
        await page.keyboard.press('Enter')

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
        await deleteButtons[2].click({ timeout: 500 })
        await deleteConfirmationButton.click()

        const rowPromises = page
            .getByTestId('auctions-table')
            .getByRole('row')
            .all()
        const rows = await Promise.all(await rowPromises)
        const rowContent = await Promise.all(rows.map(getRowContent))

        // Then
        expect(rowContent).toEqual(expectedRows)
    })
})
