export const providerKeys = {
  all: ['providers'] as const,
  me: () => ['providers', 'me'] as const,
  public: (slug: string) => ['providers', 'public', slug] as const,
  categories: () => ['categories'] as const,
}
