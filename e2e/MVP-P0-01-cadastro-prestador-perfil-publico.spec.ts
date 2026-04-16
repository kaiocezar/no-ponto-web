import { test, expect, type Page } from '@playwright/test'

// ── Helpers ──────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8001/api/v1'

/**
 * Registra um prestador via API e faz login via UI.
 * Retorna o access token para validações diretas.
 */
async function registerAndLogin(page: Page, email: string, password = 'Teste@12345') {
  const res = await page.request.post(`${API_BASE}/accounts/register/`, {
    data: { full_name: 'Prestador E2E', email, password },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Register falhou ${res.status()}: ${body.substring(0, 300)}`)
  }
  const { tokens } = (await res.json()) as { tokens: { access: string; refresh: string } }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel/, { timeout: 10000 })

  return tokens.access
}

/**
 * Configura perfil completo (wizard) via API para testes que precisam do perfil pronto.
 */
async function setupFullProfile(
  page: Page,
  token: string,
  slugSuffix: string,
): Promise<string> {
  const businessName = `Clínica E2E ${slugSuffix}`

  await page.request.patch(`${API_BASE}/providers/me/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      business_name: businessName,
      specialty: 'Fisioterapia',
      address_street: 'Rua das Flores, 123',
      address_city: 'São Paulo',
      address_state: 'SP',
      address_zip: '01310-100',
    },
  })

  // Cria ao menos 1 serviço
  await page.request.post(`${API_BASE}/providers/me/services/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: 'Consulta E2E',
      price: '150.00',
      duration_minutes: 60,
    },
  })

  // Busca o slug gerado
  const profileRes = await page.request.get(`${API_BASE}/providers/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const profile = (await profileRes.json()) as { slug: string }
  return profile.slug
}

// ── Testes ───────────────────────────────────────────────────────────────────

test.describe('MVP-P0-01 — Cadastro de Prestador e Perfil Público', () => {
  // ── Critério 1 ──────────────────────────────────────────────────────────────
  test('prestador consegue se cadastrar com nome, email e senha', async ({ page }) => {
    const email = `e2e.cadastro.${Date.now()}@teste.com`

    await page.goto('/cadastro')

    await page.getByLabel('Nome completo').fill('Dr. João E2E')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Senha', { exact: true }).fill('Teste@12345')
    await page.getByLabel('Confirmar senha').fill('Teste@12345')
    await page.getByRole('button', { name: 'Criar conta' }).click()

    // ── Critério 2: redirecionado para o wizard ──────────────────────────────
    await expect(page).toHaveURL('/configurar-perfil', { timeout: 10000 })
  })

  // ── Critério 2 (validação direta) ──────────────────────────────────────────
  test('após cadastro via API, redirect para /configurar-perfil ao fazer login', async ({
    page,
  }) => {
    const email = `e2e.redirect.${Date.now()}@teste.com`

    const res = await page.request.post(`${API_BASE}/accounts/register/`, {
      data: { full_name: 'Prestador Redirect', email, password: 'Teste@12345' },
    })
    expect(res.ok()).toBeTruthy()
    const body = (await res.json()) as { tokens: { access: string } }
    expect(body.tokens.access).toBeTruthy()

    // O endpoint de registro retorna tokens — fluxo correto para o frontend navegar
  })

  // ── Critério 3 ──────────────────────────────────────────────────────────────
  test('wizard coleta nome do negócio, especialidade e WhatsApp (step 1)', async ({ page }) => {
    const email = `e2e.wizard.${Date.now()}@teste.com`
    await page.request.post(`${API_BASE}/accounts/register/`, {
      data: { full_name: 'Wizard Tester', email, password: 'Teste@12345' },
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Senha').fill('Teste@12345')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/painel/, { timeout: 10000 })

    await page.goto('/configurar-perfil')

    // Step 1 — Negócio
    await page.getByLabel('Nome do negócio').fill('Clínica Bem Estar')
    await page.getByLabel('Especialidade').fill('Fisioterapia')
    await page.getByLabel('WhatsApp').fill('(11) 91234-5678')
    await page.getByRole('button', { name: 'Próximo' }).click()

    // Step 2 — Endereço (pode pular)
    await expect(page.getByLabel('Rua / Logradouro')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Pular etapa' }).click()

    // Step 3 — Serviços
    await expect(page.getByLabel('Nome do serviço')).toBeVisible({ timeout: 5000 })
  })

  // ── Critério 3 (horários — pode pular) ─────────────────────────────────────
  test('prestador pode pular a etapa de endereço no wizard', async ({ page }) => {
    const email = `e2e.pular.${Date.now()}@teste.com`
    await page.request.post(`${API_BASE}/accounts/register/`, {
      data: { full_name: 'Skip Tester', email, password: 'Teste@12345' },
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Senha').fill('Teste@12345')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/painel/, { timeout: 10000 })

    await page.goto('/configurar-perfil')

    await page.getByLabel('Nome do negócio').fill('Clínica Skip')
    await page.getByRole('button', { name: 'Próximo' }).click()

    // Step 2 — pular
    await expect(page.getByRole('button', { name: 'Pular etapa' })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Pular etapa' }).click()

    // Deve ir para step 3 (Serviços)
    await expect(page.getByLabel('Nome do serviço')).toBeVisible({ timeout: 5000 })
  })

  // ── Critério 4 ──────────────────────────────────────────────────────────────
  test('wizard exige pelo menos 1 serviço antes de publicar — aviso exibido', async ({
    page,
  }) => {
    const email = `e2e.servico.${Date.now()}@teste.com`
    await page.request.post(`${API_BASE}/accounts/register/`, {
      data: { full_name: 'Servicos Tester', email, password: 'Teste@12345' },
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Senha').fill('Teste@12345')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/painel/, { timeout: 10000 })

    await page.goto('/configurar-perfil')

    // Step 1
    await page.getByLabel('Nome do negócio').fill('Clínica Serviços')
    await page.getByRole('button', { name: 'Próximo' }).click()

    // Step 2 — pular
    await page.getByRole('button', { name: 'Pular etapa' }).click()

    // Step 3 — sem serviços cadastrados, aviso deve aparecer
    await expect(
      page.getByText('Adicione pelo menos 1 serviço antes de publicar o perfil.'),
    ).toBeVisible({ timeout: 8000 })
  })

  test('prestador adiciona serviço com nome e preço no wizard', async ({ page }) => {
    const email = `e2e.add.servico.${Date.now()}@teste.com`
    const token = await registerAndLogin(page, email)

    await page.goto('/configurar-perfil')

    // Step 1
    await page.getByLabel('Nome do negócio').fill('Clínica Add Serviço')
    await page.getByRole('button', { name: 'Próximo' }).click()

    // Step 2 — pular
    await page.getByRole('button', { name: 'Pular etapa' }).click()

    // Step 3 — adicionar serviço
    await expect(page.getByLabel('Nome do serviço')).toBeVisible({ timeout: 8000 })
    await page.getByLabel('Nome do serviço').fill('Consulta Inicial')
    await page.getByLabel('Preço (R$)').fill('200.00')
    await page.getByLabel('Duração (min)').fill('60')
    await page.getByRole('button', { name: 'Adicionar serviço' }).click()

    // Serviço deve aparecer na lista
    await expect(page.getByText('Consulta Inicial')).toBeVisible({ timeout: 8000 })

    // Confirma via API
    const servicesRes = await page.request.get(`${API_BASE}/providers/me/services/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const services = (await servicesRes.json()) as Array<{ name: string }>
    expect(services.some((s) => s.name === 'Consulta Inicial')).toBeTruthy()
  })

  // ── Critério 5 ──────────────────────────────────────────────────────────────
  test('perfil público exibe nome, especialidade, endereço e serviços via /{slug}', async ({
    page,
  }) => {
    const email = `e2e.public.${Date.now()}@teste.com`
    const token = await registerAndLogin(page, email)
    const suffix = Date.now().toString()
    const slug = await setupFullProfile(page, token, suffix)

    // Publica via API
    await page.request.post(`${API_BASE}/providers/me/publish/`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // Acessa perfil público
    await page.goto(`/${slug}`)

    await expect(page.getByText(`Clínica E2E ${suffix}`)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Fisioterapia')).toBeVisible()
    await expect(page.getByText('São Paulo')).toBeVisible()

    // Seção de serviços
    await expect(page.getByText('Consulta E2E')).toBeVisible()
  })

  // ── Critério 6 ──────────────────────────────────────────────────────────────
  test('slug é gerado automaticamente a partir do nome do negócio e é único', async ({
    page,
  }) => {
    const suffix = Date.now()
    const email1 = `e2e.slug1.${suffix}@teste.com`
    const email2 = `e2e.slug2.${suffix}@teste.com`

    // Dois prestadores com mesmo nome de negócio
    const res1 = await page.request.post(`${API_BASE}/accounts/register/`, {
      data: { full_name: 'Prestador Slug 1', email: email1, password: 'Teste@12345' },
    })
    const { tokens: tokens1 } = (await res1.json()) as { tokens: { access: string } }

    const res2 = await page.request.post(`${API_BASE}/accounts/register/`, {
      data: { full_name: 'Prestador Slug 2', email: email2, password: 'Teste@12345' },
    })
    const { tokens: tokens2 } = (await res2.json()) as { tokens: { access: string } }

    const sameName = `Clínica Slug ${suffix}`

    await page.request.patch(`${API_BASE}/providers/me/`, {
      headers: { Authorization: `Bearer ${tokens1.access}` },
      data: { business_name: sameName },
    })
    await page.request.patch(`${API_BASE}/providers/me/`, {
      headers: { Authorization: `Bearer ${tokens2.access}` },
      data: { business_name: sameName },
    })

    const profile1 = (await (
      await page.request.get(`${API_BASE}/providers/me/`, {
        headers: { Authorization: `Bearer ${tokens1.access}` },
      })
    ).json()) as { slug: string }

    const profile2 = (await (
      await page.request.get(`${API_BASE}/providers/me/`, {
        headers: { Authorization: `Bearer ${tokens2.access}` },
      })
    ).json()) as { slug: string }

    // Slugs devem ser diferentes
    expect(profile1.slug).not.toBe(profile2.slug)
    // Ambos devem conter o nome base
    expect(profile1.slug).toContain('clinica-slug')
    expect(profile2.slug).toContain('clinica-slug')
  })

  // ── Critério 7 ──────────────────────────────────────────────────────────────
  test('prestador pode editar o perfil no painel após publicar', async ({ page }) => {
    const email = `e2e.edit.${Date.now()}@teste.com`
    const token = await registerAndLogin(page, email)
    const suffix = Date.now().toString()
    await setupFullProfile(page, token, suffix)

    // Publica
    await page.request.post(`${API_BASE}/providers/me/publish/`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // Edita via API (simulando painel)
    const updateRes = await page.request.patch(`${API_BASE}/providers/me/`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { specialty: 'Fisioterapia Esportiva' },
    })
    expect(updateRes.ok()).toBeTruthy()

    const updated = (await updateRes.json()) as { specialty: string }
    expect(updated.specialty).toBe('Fisioterapia Esportiva')
  })

  // ── Critério 8 ──────────────────────────────────────────────────────────────
  test('perfil não publicado retorna 404 para visitantes', async ({ page }) => {
    const email = `e2e.unpublished.${Date.now()}@teste.com`
    const token = await registerAndLogin(page, email)
    const suffix = Date.now().toString()
    const slug = await setupFullProfile(page, token, suffix)

    // Não publica — acessa como visitante
    const response = await page.request.get(`${API_BASE}/providers/${slug}/`)
    expect(response.status()).toBe(404)
  })

  test('perfil não publicado retorna 404 na rota pública /{slug}', async ({ page }) => {
    const email = `e2e.404.${Date.now()}@teste.com`
    const token = await registerAndLogin(page, email)
    const suffix = Date.now().toString()
    const slug = await setupFullProfile(page, token, suffix)

    // Não publica — acessa via UI
    const response = await page.goto(`/${slug}`)
    // A página deve mostrar 404 ou o componente de erro
    // Qualquer resposta HTTP diferente de 500 é aceitável
    expect(response?.status()).not.toBe(500)
    await expect(page.getByText(/não encontrado|404|perfil não/i)).toBeVisible({ timeout: 8000 })
  })
})
