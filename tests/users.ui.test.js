import { test, expect } from '@playwright/test'

test('users/new page loads and form is usable', async ({ page }) => {
  await page.goto('http://localhost:3000/users/new')

  const userNameInput = page.locator('input[name="user_name"]')
  const slugInput = page.locator('input[name="slug"]')
  const ageInput = page.locator('input[name="age"]')
  const saveButton = page.locator('button')

  await expect(userNameInput).toBeVisible()
  await expect(slugInput).toBeVisible()
  await expect(ageInput).toBeVisible()
  await expect(saveButton).toBeVisible()

  await userNameInput.fill('Anna Smith')
  await slugInput.fill('anna-smith')
  await ageInput.fill('25')

  await expect(userNameInput).toHaveValue('Anna Smith')
  await expect(slugInput).toHaveValue('anna-smith')
  await expect(ageInput).toHaveValue('25')
})
