import { test, expect } from '@playwright/test'

test('health endpoint', async ({ request }) => {
  const res = await request.get('/health')
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  expect(json.ok).toBe(true)
})

test('home loads and cart link works', async ({ page }) => {
  await page.goto('/?freeze=1')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Cart' }).first().click()
  await expect(page.getByTestId('checkout-button')).toBeVisible()
})
