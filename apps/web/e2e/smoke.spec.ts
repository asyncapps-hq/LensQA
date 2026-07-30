import { test, expect } from '@playwright/test'

// Lightweight dashboard smoke (run from apps/web after install)
test('marketing loads', async ({ page }) => {
  await page.goto('/?motion=off')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('failed run review', async ({ page }) => {
  await page.goto('/runs/run_fail?motion=off')
  await expect(page.getByText('fix/checkout-css')).toBeVisible()
  await page.goto('/review/res_fail_cart_mobile?motion=off')
  await expect(page.getByText('Review cart@mobile')).toBeVisible()
})
