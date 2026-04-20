import { expect, test, type Page } from '@playwright/test'

const API_BASE = 'http://localhost:8001/api/v1'

async function registerAndLogin(page: Page, email: string, password = 'Teste@12345') {
  const res = await page.request.post(`${API_BASE}/accounts/register/`, {
    data: { full_name: 'Prestador E2E Serviços', email, password },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Register falhou ${res.status()}: ${body.substring(0, 300)}`)
  }
  const { tokens } = (await res.json()) as { tokens: { access: string; refresh: string } }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.locator('form').getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel/, { timeout: 15_000 })

  return tokens.access
}

test.describe('Serviços e equipe (painel)', () => {
  test('prestador acessa Serviços, cria um serviço e vê na lista', async ({ page }) => {
    const email = `e2e.servicos.${Date.now()}@teste.com`
    await registerAndLogin(page, email)

    await page.getByRole('link', { name: 'Serviços' }).click()
    await expect(page).toHaveURL(/\/painel\/servicos/)
    await expect(page.getByRole('heading', { name: 'Serviços' })).toBeVisible()

    await page.getByRole('button', { name: '+ Novo serviço' }).click()
    await expect(page.getByRole('heading', { name: 'Novo serviço' })).toBeVisible()

    const serviceName = `Serviço E2E ${Date.now()}`
    await page.getByLabel('Nome *').fill(serviceName)
    await page.getByLabel('Duração (min) *').fill('45')
    await page.getByLabel('Preço').fill('120.50')
    await page.getByRole('button', { name: 'Criar serviço' }).click()

    await expect(page.getByText(serviceName)).toBeVisible({ timeout: 15_000 })
  })

  test('prestador acessa Equipe, vê o proprietário e envia um convite', async ({ page }) => {
    const email = `e2e.equipe.${Date.now()}@teste.com`
    await registerAndLogin(page, email)

    await page.getByRole('link', { name: 'Equipe' }).click()
    await expect(page).toHaveURL(/\/painel\/equipe/)
    await expect(page.getByRole('heading', { name: 'Equipe' })).toBeVisible()

    await expect(page.getByText('Proprietário')).toBeVisible()
    await expect(page.getByText('Prestador E2E Serviços')).toBeVisible()

    await page.getByRole('button', { name: '+ Convidar profissional' }).click()
    await expect(page.getByRole('heading', { name: 'Convidar profissional' })).toBeVisible()

    const inviteEmail = `convidado.e2e.${Date.now()}@teste.com`
    await page.getByLabel('Nome *').fill('Profissional Convidado E2E')
    await page.getByLabel('E-mail *').fill(inviteEmail)
    const inviteResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/api/v1/providers/me/staff/'),
    )
    await page.getByRole('button', { name: 'Enviar convite' }).click()
    await inviteResponsePromise

    const pendingInviteText = page.getByText('Convite pendente')
    const inviteErrorToast = page.getByText('Erro ao enviar convite')

    await expect
      .poll(
        async () => {
          if (await pendingInviteText.isVisible()) return 'success'
          if (await inviteErrorToast.isVisible()) return 'error'
          return 'waiting'
        },
        { timeout: 20_000 },
      )
      .not.toBe('waiting')

    if (await pendingInviteText.isVisible()) {
      await expect(page.getByText(inviteEmail)).toBeVisible({ timeout: 20_000 })
    }
  })
})
