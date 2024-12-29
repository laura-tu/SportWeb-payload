import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { URLParams } from '..'
//import type { TestResult } from '@/payload/payload-types'
import { getTestResults } from '../test-results'

export const useTestResultsQuery = (params: URLParams) => {
  return useQuery({
    queryKey: ['test_results', params],
    queryFn: () => getTestResults(params),
    enabled: Boolean(params),
  })
}
