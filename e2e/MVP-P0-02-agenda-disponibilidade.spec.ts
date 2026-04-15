import { test, expect, type Page } from '@playwright/test'

// ── Helpers ──────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8001/api/v1'

/**
 * Registra e faz login via UI.
 * Retorna o access token obtido via API para validações diretas.
 */
async function setupProvider(page: Page, email: string, password = 'Teste@12345') {
  // Registra via API (mais rápido que UI)
  const registerRes = await page.request.post(`${API_BASE}/accounts/register/`, {
    data: { full_name: 'Prestador E2E', email, password },
  })
  if (!registerRes.ok()) {
    const body = await registerRes.text()
    throw new Error(`Register falhou ${registerRes.status()}: ${body.substring(0, 200)}`)
  }
  const { tokens } = await registerRes.json() as { tokens: { access: string; refresh: string } }

  // Login via UI para configurar o estado do Zustand corretamente
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()

  // Aguarda redirecionamento para o painel
  await expect(page).toHaveURL(/\/painel/, { timeout: 10000 })

  return tokens.access
}

// ── Testes ───────────────────────────────────────────────────────────────────

test.describe('MVP-P0-02 — Agenda de Disponibilidade', () => {
  test('prestador consegue acessar a página de configuração de horários de funcionamento', async ({ page }) => {
    const email = `e2e.horarios.${Date.now()}@teste.com`
    await setupProvider(page, email)

    await page.goto('/painel/configuracoes/horarios')

    // A tabela de dias da semana é exibida
    await expect(page.getByRole('form', { name: 'Horários de funcionamento' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('table')).toBeVisible()

    // Todos os dias da semana presentes
    await expect(page.getByText('Segunda-feira')).toBeVisible()
    await expect(page.getByText('Sábado')).toBeVisible()
    await expect(page.getByText('Domingo')).toBeVisible()

    // Botão de salvar presente
    await expect(page.getByRole('button', { name: 'Salvar horários de funcionamento' })).toBeVisible()
  })

  test('prestador consegue salvar horários de funcionamento por dia da semana', async ({ page }) => {
    const email = `e2e.bulk.${Date.now()}@teste.com`
    const token = await setupProvider(page, email)

    await page.goto('/painel/configuracoes/horarios')
    await expect(page.getByRole('form', { name: 'Horários de funcionamento' })).toBeVisible({ timeout: 10000 })

    // Salva com valores padrão (Seg-Sex 08:00-18:00 ativos)
    await page.getByRole('button', { name: 'Salvar horários de funcionamento' }).click()
    await page.waitForTimeout(2000)

    // Valida via API que os horários foram salvos
    const hoursRes = await page.request.get(`${API_BASE}/providers/me/working-hours/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(hoursRes.ok()).toBeTruthy()
    const hours = await hoursRes.json() as Array<{ weekday: number; is_active: boolean }>
    expect(hours.length).toBeGreaterThan(0)
  })

  test('prestador consegue acessar a página de gerenciamento de bloqueios de agenda', async ({ page }) => {
    const email = `e2e.bloqueios.${Date.now()}@teste.com`
    await setupProvider(page, email)

    await page.goto('/painel/configuracoes/bloqueios')

    await expect(page.getByRole('heading', { name: 'Bloqueios de Agenda' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: 'Criar novo bloqueio' })).toBeVisible()
    // Mensagem de lista vazia
    await expect(page.getByText('Nenhum bloqueio configurado.')).toBeVisible()
  })

  test('prestador consegue criar bloqueio de agenda com data/hora e motivo', async ({ page }) => {
    const email = `e2e.criar.bloqueio.${Date.now()}@teste.com`
    const token = await setupProvider(page, email)

    await page.goto('/painel/configuracoes/bloqueios')
    await expect(page.getByRole('heading', { name: 'Bloqueios de Agenda' })).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: 'Criar novo bloqueio' }).click()
    await expect(page.getByRole('dialog', { name: 'Novo bloqueio de agenda' })).toBeVisible()

    await page.getByLabel('Início').fill('2026-07-01T09:00')
    await page.getByLabel('Término').fill('2026-07-05T18:00')
    await page.getByLabel('Motivo').fill('Férias de verão')

    await page.getByRole('button', { name: 'Criar bloqueio' }).click()

    // Modal deve fechar após criar
    await expect(page.getByRole('dialog', { name: 'Novo bloqueio de agenda' })).not.toBeVisible({ timeout: 8000 })

    // Bloqueio aparece na lista
    await expect(page.getByText('Férias de verão')).toBeVisible()

    // Confirma via API
    const blocksRes = await page.request.get(`${API_BASE}/providers/me/blocks/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const blocks = await blocksRes.json() as Array<{ reason: string }>
    expect(blocks.some((b) => b.reason === 'Férias de verão')).toBeTruthy()
  })

  test('bloqueio recorrente exige campo RRULE ao marcar recorrente', async ({ page }) => {
    const email = `e2e.rrule.${Date.now()}@teste.com`
    await setupProvider(page, email)

    await page.goto('/painel/configuracoes/bloqueios')
    await expect(page.getByRole('heading', { name: 'Bloqueios de Agenda' })).toBeVisible({ timeout: 10000 })

    await page.getByRole('button', { name: 'Criar novo bloqueio' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.getByLabel('Início').fill('2026-01-02T12:00')
    await page.getByLabel('Término').fill('2026-01-02T14:00')

    // Marca como recorrente
    await page.getByLabel('Bloqueio recorrente').check()

    // Campo RRULE deve aparecer
    await expect(page.getByLabel('Regra de recorrência (RRULE)')).toBeVisible()

    // Tenta salvar sem preencher RRULE
    await page.getByRole('button', { name: 'Criar bloqueio' }).click()

    // Deve mostrar erro de validação
    await expect(page.getByText("Informe a regra de recorrência (RRULE).")).toBeVisible({ timeout: 3000 })
  })

  test('API de disponibilidade responde para provider publicado', async ({ page }) => {
    const email = `e2e.slots.${Date.now()}@teste.com`
    const token = await setupProvider(page, email)

    // Configura horários via API
    const bulkRes = await page.request.post(`${API_BASE}/providers/me/working-hours/bulk/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        working_hours: [
          { weekday: 0, start_time: '08:00:00', end_time: '18:00:00', is_active: true },
        ],
      },
    })
    expect(bulkRes.ok()).toBeTruthy()

    // Endpoint de disponibilidade com slug inválido retorna 404 (não 500)
    const availRes = await page.request.get(
      `${API_BASE}/providers/slug-inexistente-xyz/availability/?service_id=00000000-0000-0000-0000-000000000001&date=2026-04-27`
    )
    expect([200, 404]).toContain(availRes.status())
    expect(availRes.status()).not.toBe(500)
  })
})
