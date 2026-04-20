export const reviewKeys = {
  all: ['reviews'] as const,
  byToken: (token: string) => [...reviewKeys.all, 'token', token] as const,
  provider: (rating?: number) => [...reviewKeys.all, 'provider', rating ?? 'all'] as const,
  publicList: (slug: string) => [...reviewKeys.all, 'public-list', slug] as const,
  publicSummary: (slug: string) => [...reviewKeys.all, 'public-summary', slug] as const,
}
