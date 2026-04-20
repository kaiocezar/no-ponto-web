export const dashboardKeys = {
  all: ['dashboard'] as const,
  home: (date?: string) => [...dashboardKeys.all, 'home', date ?? 'today'] as const,
}
