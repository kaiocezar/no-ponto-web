import { expect, test } from '@playwright/test'

const CLIENT_EMAIL = process.env.E2E_CLIENT_EMAIL
const CLIENT_PASSWORD = process.env.E2E_CLIENT_PASSWORD
const REVIEW_TOKEN = process.env.E2E_REVIEW_TOKEN

test.describe('P2 histórico do cliente e avaliação', () => {
  test('cliente autenticado acessa /minha-conta/agendamentos e alterna abas', async ({ page }) => {
    test.skip(!CLIENT_EMAIL || !CLIENT_PASSWORD, 'Defina E2E_CLIENT_EMAIL e E2E_CLIENT_PASSWORD.')

    await page.goto('/login')
    await page.getByLabel('Email').fill(CLIENT_EMAIL!)
    await page.getByLabel('Senha').fill(CLIENT_PASSWORD!)
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click()

    await page.goto('/minha-conta/agendamentos')
    await expect(page.getByRole('heading', { name: 'Meus agendamentos' })).toBeVisible()
    await page.getByRole('button', { name: 'Passados' }).click()
    await expect(page.getByRole('button', { name: 'Passados' })).toBeVisible()
  })

  test('cliente abre /avaliar/:token e envia avaliação', async ({ page }) => {
    test.skip(!REVIEW_TOKEN, 'Defina E2E_REVIEW_TOKEN para envio de avaliação.')

    await page.goto(`/avaliar/${REVIEW_TOKEN}`)
    await expect(page.getByRole('heading', { name: 'Como foi seu atendimento?' })).toBeVisible()
    await page.getByRole('radio').nth(4).click()
    await page.getByLabel('Comentário (opcional)').fill('Atendimento excelente no fluxo E2E')
    await page.getByRole('button', { name: 'Enviar avaliação' }).click()
    await expect(page.getByRole('heading', { name: 'Avaliação enviada' })).toBeVisible()
  })
})
