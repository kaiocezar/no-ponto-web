import { expect, test } from '@playwright/test'

const PROVIDER_EMAIL = process.env.E2E_PROVIDER_EMAIL
const PROVIDER_PASSWORD = process.env.E2E_PROVIDER_PASSWORD

test.describe('Painel do prestador — agenda', () => {
  test('login e vista de agenda (FullCalendar)', async ({ page }) => {
    test.skip(
      !PROVIDER_EMAIL || !PROVIDER_PASSWORD,
      'Defina E2E_PROVIDER_EMAIL e E2E_PROVIDER_PASSWORD para correr este teste.',
    )

    await page.goto('/login')

    await page.getByLabel('Email').fill(PROVIDER_EMAIL!)
    await page.getByLabel('Senha').fill(PROVIDER_PASSWORD!)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/painel\/agenda/)
    await expect(page.locator('.fc')).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('button', { name: 'Novo agendamento' })).toBeVisible()

    await page.getByRole('button', { name: 'Novo agendamento' }).click()
    await expect(page.getByRole('dialog', { name: 'Novo agendamento' })).toBeVisible()
  })
})
