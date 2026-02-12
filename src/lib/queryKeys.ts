// Type-safe query key factories
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (page: number) => [...queryKeys.users.lists(), page] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    lists: () => [...queryKeys.organizations.all, 'list'] as const,
    list: (page: number) => [...queryKeys.organizations.lists(), page] as const,
    details: () => [...queryKeys.organizations.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.organizations.details(), id] as const,
  },
  policeOfficers: {
    all: ['policeOfficers'] as const,
    lists: () => [...queryKeys.policeOfficers.all, 'list'] as const,
    list: (filters: { page: number; organizationId?: number }) =>
      [...queryKeys.policeOfficers.lists(), filters] as const,
    details: () => [...queryKeys.policeOfficers.all, 'detail'] as const,
    detail: (id: number) =>
      [...queryKeys.policeOfficers.details(), id] as const,
  },
} as const
