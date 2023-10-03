import { test, expect, Page } from '@playwright/test'
const { describe } = test

describe('Home Page', () => {
    test('Should have the correct title', async ({ page }) => {
        // Given
        await page.goto('http://localhost:3000')

        // Then
        await expect(page).toHaveTitle('Home')
    })

    test('Should show have Auctions, Teams, Seasons and Players options in the page', async ({
        page,
    }) => {
        // Given
        await page.goto('http://localhost:3000')

        // When
        const menuItemLocators = await page.getByRole('menuitem').all()
        const locatorPromises = menuItemLocators.map((menuItem) =>
            menuItem.textContent()
        )
        const menuItems = await Promise.all(locatorPromises)

        // Then
        expect(menuItems).toEqual(['Auctions', 'Teams', 'Seasons', 'Players'])
    })

    test('Should navigate to Players page on clicking Players option', async ({
        page,
    }) => {
        // Given
        await page.goto('http://localhost:3000')

        // When
        await page.getByRole('menuitem', { name: 'Players' }).click()

        // Then
        await expect(page).toHaveURL('http://localhost:3000/players')
    })

    test('Should navigate to Teams page on clicking Teams option', async ({
        page,
    }) => {
        // Given
        await page.goto('http://localhost:3000')

        // When
        await page.getByRole('menuitem', { name: 'Teams' }).click()

        // Then
        await expect(page).toHaveURL('http://localhost:3000/teams')
    })
})
