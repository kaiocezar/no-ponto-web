import { expect, test, type Page } from '@playwright/test'

const API_BASE = 'http://localhost:8001/api/v1'

async function registerAndLoginProvider(page: Page, email: string, password = 'Teste@12345') {
  const registerRes = await page.request.post(`${API_BASE}/accounts/register/`, {
    data: { full_name: 'Prestador Dashboard E2E', email, password },
  })
  if (!registerRes.ok()) {
    const responseText = await registerRes.text()
    throw new Error(
      `Falha ao registrar prestador E2E (${registerRes.status()}): ${responseText.slice(0, 300)}`,
    )
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.locator('form').getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel/, { timeout: 15_000 })
}

test.describe('P2 dashboard e avaliações', () => {
  test('prestador acessa /painel e vê cards + próximos agendamentos', async ({ page }) => {
    const email = `e2e.dashboard.${Date.now()}@teste.com`
    await registerAndLoginProvider(page, email)

    await page.goto('/painel')
    await expect(page.getByRole('heading', { name: 'Painel' })).toBeVisible()
    await expect(page.getByText('Hoje', { exact: true })).toBeVisible()
    await expect(page.getByText('Confirmados', { exact: true })).toBeVisible()
    await expect(page.getByText('Pendentes', { exact: true })).toBeVisible()
    await expect(page.getByText('Cancelados', { exact: true })).toBeVisible()
    await expect(page.getByText('Próximos agendamentos')).toBeVisible()
  })

  test('visitante abre perfil público e visualiza seção de avaliações', async ({ page }) => {
    const slug = process.env.E2E_PROVIDER_SLUG_FOR_REVIEWS
    test.skip(!slug, 'Defina E2E_PROVIDER_SLUG_FOR_REVIEWS para validar avaliações públicas.')

    await page.goto(`/${slug}`)
    await expect(page.getByText('Avaliações')).toBeVisible()
  })
})
