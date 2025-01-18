import type { PayloadRequest } from 'payload/types'
import { i18nConfig } from '../../../utils/translations'
import { Namespaces } from '../../../utils/translations'
import type { AfterChangeHook, BeforeChangeHook } from 'payload/dist/collections/config/types'

// Function to generate the subject for a forgot password email
export const forgotPasswordSubject = async (props: {
  req: PayloadRequest
  user: any
}): Promise<string> => {
  let lng = props.req.acceptsLanguages(i18nConfig.supportedLngs) || i18nConfig.fallbackLng
  return props.req.t('forgotPassword.subject', { lng, ns: Namespaces.EMAILS })
}

// Function to generate the body for a forgot password email
export const forgotPassword = async (params: {
  req: PayloadRequest
  token: string
  user: any
}): Promise<string> => {
  const { token, req } = params
  let lng = req.acceptsLanguages(i18nConfig.supportedLngs) || i18nConfig.fallbackLng
  const t = params.req.t
  const url = process.env.VERIFICATION_URL

  return t('forgotPassword.body', {
    lng,
    ns: Namespaces.EMAILS,
    link: `${url}/${t('forgotPassword.link', { lng, ns: Namespaces.EMAILS, token })}`,
    url,
  })
}

export const verify = async (params: {
  req: PayloadRequest
  token: string
  user: any
}): Promise<string> => {
  const { token, req } = params
  let lng = req.acceptsLanguages(i18nConfig.supportedLngs) || i18nConfig.fallbackLng
  const t = params.req.t
  const url = process.env.VERIFICATION_URL

  if (params.user._verified) return t('alreadyVerified.body', { lng, ns: Namespaces.EMAILS })
  return t('verify.body', {
    lng,
    ns: Namespaces.EMAILS,
    link: `${url}/${t('verify.link', { lng, ns: Namespaces.EMAILS, token })}`,
    url,
  })
}

export const verifySubject = async (props: { req: PayloadRequest; user: any }): Promise<string> => {
  let lng = props.req.acceptsLanguages(i18nConfig.supportedLngs) || i18nConfig.fallbackLng
  return props.req.t('verify.subject', { lng, ns: Namespaces.EMAILS })
}

export const checkVerification: BeforeChangeHook = async ({ data, operation }) => {
  if (operation === 'create' && !process.env.VERIFICATION_URL) {
    data._verified = true
    return data
  }
}

export const sendVerifiedEmail: AfterChangeHook = async ({ doc, req, operation }) => {
  if (
    operation === 'create' &&
    !doc._verified &&
    process.env.VERIFICATION_URL.includes(req.headers.origin)
  ) {
    let lng = req.acceptsLanguages(i18nConfig.supportedLngs) || i18nConfig.fallbackLng
    const t = req.t
    const url = process.env.VERIFICATION_URL

    await req.payload.sendEmail({
      to: doc.email,
      from: process.env.SMTP_USER,
      subject: req.t('signup.subject', { lng, ns: Namespaces.EMAILS }),
      html: req.t('signup.body', {
        lng,
        ns: Namespaces.EMAILS,
        email: doc.email,
        login: `${url}/${t('signup.login', { lng, ns: Namespaces.EMAILS })}`,
        signup: `${url}/${t('signup.signup', { lng, ns: Namespaces.EMAILS })}`,
      }),
    })
  }
}
