import { useMemo, useCallback } from 'react'
import { OstDocument } from '@/types/public'

type SortDirection = 'ascending' | 'descending'

export type SortConfig = {
  key: keyof OstDocument
  direction: SortDirection
}

export const useSortedDocuments = (
  documents: OstDocument[],
  sortConfig: SortConfig
) => {
  const sortFunction = useCallback(
    (a: OstDocument, b: OstDocument): number => {
      const { key, direction } = sortConfig
      const multiplier = direction === 'ascending' ? 1 : -1

      if (key === 'publishedAt') {
        const dateA = a[key] ? new Date(a[key]).getTime() : 0
        const dateB = b[key] ? new Date(b[key]).getTime() : 0
        return (dateA - dateB) * multiplier
      }

      if (key === 'status') {
        if (a.status === b.status) {
          return a.title.localeCompare(b.title) * multiplier
        }
        return (a.status === 'published' ? 1 : -1) * multiplier
      }

      const valueA = a[key] as string | number
      const valueB = b[key] as string | number

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * multiplier
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * multiplier
      }

      // Fallback for other types
      return 0
    },
    [sortConfig]
  )

  return useMemo(() => {
    return [...documents].sort(sortFunction)
  }, [documents, sortFunction])
}
