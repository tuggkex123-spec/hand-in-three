import { test, expect } from '@playwright/test'

test('user can create a new user and see it in the users list', async ({ page }) => {
  const uniqueSlug = `anna-smith-${Date.now()}`
  const uniqueName = `Anna Smith ${Date.now()}`

  await page.goto('http://localhost:3000/users/new')

  await page.fill('input[name="user_name"]', uniqueName)
  await page.fill('input[name="slug"]', uniqueSlug)
  await page.fill('input[name="age"]', '25')

  await page.click('button')

  await expect(page).toHaveURL(/\/users$/)
  await expect(page.locator('body')).toContainText(uniqueName)
  await expect(page.locator('body')).toContainText(uniqueSlug)
})
