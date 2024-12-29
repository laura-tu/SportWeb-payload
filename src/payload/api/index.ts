import axios from 'axios'
import type { Where } from 'payload/types'
import qs from 'qs'
import type { Config } from '../payload-types'

export const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: function (status) {
    return status < 300
  },
})

export interface ApiGetList<T> {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

export interface ApiPostResponse<T> {
  doc: T
  message: string
}

export interface URLParams {
  where?: Where
  limit?: number
  page?: number
  depth?: number
  sort?: string
}

export interface URLInfiniteParams extends Omit<URLParams, 'page'> {
  pagination: boolean
}

export type BaseParams = URLParams | URLInfiniteParams

export interface ParamsWithId {
  id: Id
  depth?: number
}

type Id = number | string

export type CollectionKey = keyof Config['collections']

export const NO_LIMIT = 10000

export const constructUrlWithParams = (url: CollectionKey, params: BaseParams = {}): string => {
  if ('pagination' in params && params.pagination === false) {
    params.limit = NO_LIMIT
  }
  const queryParams = qs.stringify(params)
  const queryString = queryParams ? `?${queryParams}` : ''
  return `/${url}${queryString}`
}

export const constructUrlWithId = (url: CollectionKey, params: ParamsWithId): string => {
  const { id, depth = 1 } = params
  return `${url}/${id}?${qs.stringify({ depth })}`
}

export const getCollection = async <T>(
  key: CollectionKey,
  params: URLParams,
): Promise<ApiGetList<T>> => {
  const { data } = await axiosInstance.get<ApiGetList<T>>(constructUrlWithParams(key, params))
  return data
}
