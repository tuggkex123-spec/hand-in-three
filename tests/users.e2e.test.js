import { test, expect } from '@playwright/test'

test('user can create a new user', async ({ page }) => {
  const uniqueSlug = `anna-smith-${Date.now()}`
  const uniqueName = 'Anna Smith'
  const uniqueAge = String((Date.now() % 100) + 1)

  await page.goto('http://localhost:3000/users/new')

  await page.fill('input[name="user_name"]', uniqueName)
  await page.fill('input[name="slug"]', uniqueSlug)
  await page.fill('input[name="age"]', uniqueAge)

  await page.click('button')

  await expect(page).toHaveURL(/\/users$/)
})
