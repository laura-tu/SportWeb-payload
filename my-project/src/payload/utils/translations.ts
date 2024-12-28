import type { TOptions } from 'i18next'
import i18next, { init, t as translate } from 'i18next'
import { useState } from 'react'
import sk from '../translations/sk/index'
import type { ModuleCode } from '../constants'

export enum Namespaces {
  COLLECTIONS = 'collections',
  AUTHENTICATION = 'authentication',
  FIELDS = 'fields',
  ERROR = 'error',
  GENERAL = 'general',
  OPERATORS = 'operators',
  VALIDATION = 'validation',
  VERSION = 'version',
}

const FALLBACK_LNG = 'sk'

export const i18nConfig = {
  debug: false,
  fallbackLng: FALLBACK_LNG,
  lng: 'sk',
  supportedLngs: ['sk', 'en'],
  preload: ['sk'],
  returnObjects: true,
  defaultNS: Namespaces.COLLECTIONS,
  resources: {
    sk,
  },
}

init({
  ...i18nConfig,
})

export const tCollection =
  (collection = 'global') =>
  (key: string): Record<string, string> => {
    const obj = {}
    Object.keys(i18next.options.resources ?? {}).forEach((lng: string) => {
      obj[lng] = translate(`${collection}.${key}`, { ns: Namespaces.COLLECTIONS, lng })
    })
    return obj
  }

export const tModule = (module: ModuleCode): Record<string, string> => {
  return tCollection()(`fields.code_module.options.${module.toLowerCase()}`)
}

const LOCAL_STORAGE_KEY = 'lng'

type Options = Omit<TOptions, 'lng'>

export const useLocale = (): string => {
  const [locale] = useState(localStorage.getItem(LOCAL_STORAGE_KEY) || FALLBACK_LNG)

  return locale
}

export const useTranslation = (): {
  lng: string
  t: (key: string, options?: Options) => string
  dateToLocale: (date: Date | string) => string
} => {
  const lng = useLocale()

  const t = (key: string, options?: Options): string => {
    return translate(key, { ...options, lng })
  }

  const dateToLocale = (date: Date | string): string => {
    return new Date(date).toLocaleDateString(lng)
  }

  return { t, lng, dateToLocale }
}
