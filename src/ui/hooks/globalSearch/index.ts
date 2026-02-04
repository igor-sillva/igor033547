import { createGlobalSearchFacade } from '~/app/facade'
import { useQuery } from 'react-query'

const facade = createGlobalSearchFacade()

export function useGlobalSearch(value: string) {
  return useQuery({
    queryKey: ['global-search', value],
    queryFn: () => facade.globalSearch(value),
    enabled: Boolean(value.trim())
  })
}
