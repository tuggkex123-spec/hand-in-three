import { test, expect } from '@playwright/test'

test('user can create a new user', async ({ page }) => {
  await page.goto('http://localhost:3000/users/new')

  await page.fill('input[name="user_name"]', 'Anna Smith')
  await page.fill('input[name="slug"]', 'anna-smith-e2e')
  await page.fill('input[name="age"]', '25')

  await page.click('button')

  await expect(page).toHaveURL(/\/users$/)
})
