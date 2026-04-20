import { expect, test } from '@playwright/test'

const PUBLIC_ID = process.env.E2E_PUBLIC_ID
const PHONE = process.env.E2E_PHONE ?? '+5511997777666'

test.describe('Fluxo público de cancelamento e reagendamento', () => {
  test('cliente faz lookup, cancela e reagenda', async ({ page }) => {
    test.skip(!PUBLIC_ID, 'E2E_PUBLIC_ID não informado para o teste.')

    await page.goto(`/agendamento/${PUBLIC_ID}`)

    await page.getByLabel('Telefone').fill(PHONE)
    await page.getByRole('button', { name: 'Consultar agendamento' }).click()

    await expect(page.getByRole('heading', { name: 'Detalhes do agendamento' })).toBeVisible()
    await page.getByRole('button', { name: 'Cancelar agendamento' }).click()

    await expect(page.getByRole('dialog', { name: 'Confirmar cancelamento' })).toBeVisible()
    await page.getByLabel('Motivo (opcional)').fill('Imprevisto de última hora')
    await page.getByRole('button', { name: 'Confirmar cancelamento' }).click()

    await expect(page.getByText('Agendamento cancelado com sucesso.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Fluxo de reagendamento' })).toBeVisible()

    const firstSlot = page.getByRole('list', { name: 'Horários disponíveis' }).getByRole('listitem').first()
    await expect(firstSlot).toBeVisible()
    await firstSlot.click()
    await page.getByRole('button', { name: 'Confirmar reagendamento' }).click()

    await expect(page.getByText('Reagendamento concluído com sucesso.')).toBeVisible()
  })
})
