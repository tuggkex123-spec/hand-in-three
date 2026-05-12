import { test, expect } from '@playwright/test'

test('users/new page loads and form is usable', async ({ page }) => {
  await page.goto('http://localhost:3000/users/new')

  await expect(page.locator('form')).toBeVisible()
  await expect(page.locator('input[name="slug"]')).toBeVisible()
  await expect(page.locator('input[name="user_name"]')).toBeVisible()
  await expect(page.locator('input[name="age"]')).toBeVisible()
  await expect(page.locator('button')).toBeVisible()

})
