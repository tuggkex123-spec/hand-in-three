# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\users.ui.test.js >> users/new page loads and form is usable
- Location: tests\users.ui.test.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[type="submit"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button[type="submit"]')

```

```yaml
- banner:
  - heading "My App" [level=1]
  - navigation:
    - link "Home":
      - /url: /
    - link "New User":
      - /url: /users/new
- main:
  - heading "Create a new user" [level=2]
  - textbox "user_name"
  - textbox "slug"
  - spinbutton
  - button "Save"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('users/new page loads and form is usable', async ({ page }) => {
  4  |   await page.goto('http://localhost:3000/users/new')
  5  | 
  6  |   await expect(page.locator('form')).toBeVisible()
  7  |   await expect(page.locator('input[name="slug"]')).toBeVisible()
  8  |   await expect(page.locator('input[name="user_name"]')).toBeVisible()
  9  |   await expect(page.locator('input[name="age"]')).toBeVisible()
> 10 |   await expect(page.locator('button[type="submit"]')).toBeVisible()
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  11 | })
  12 | 
```