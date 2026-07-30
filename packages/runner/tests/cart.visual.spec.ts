import { test, expect } from '@playwright/test'

test.describe('cart visual', () => {
  test('cart checkout CTA stable', async ({ page }, testInfo) => {
    await page.goto('/cart?freeze=1')
    await expect(page.getByTestId('checkout-button')).toBeVisible()
    await expect(page).toHaveScreenshot(`cart-${testInfo.project.name}.png`, {
      fullPage: true,
      mask: [page.locator('.live-stock')],
    })
  })

  test('checkout button region', async ({ page }, testInfo) => {
    await page.goto('/cart?freeze=1')
    const btn = page.getByTestId('checkout-button')
    await expect(btn).toHaveScreenshot(`checkout-btn-${testInfo.project.name}.png`)
  })
})
