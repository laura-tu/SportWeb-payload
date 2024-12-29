import type { TestResult } from '../payload-types'
import type { ApiGetList, URLParams, URLInfiniteParams } from '.'
import { axiosInstance } from '.'

const URL = 'test_results'

export const getTestResults = async (
  params: URLParams | URLInfiniteParams,
): Promise<ApiGetList<TestResult>> => {
  const { data } = await axiosInstance.get<ApiGetList<TestResult>>(URL, { params })

  return data
}
