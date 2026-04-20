export const staffKeys = {
  all: ['provider', 'staff'] as const,
  list: () => ['provider', 'staff', 'list'] as const,
  public: (slug: string, serviceId?: string) =>
    ['public', 'staff', slug, serviceId ?? ''] as const,
}
