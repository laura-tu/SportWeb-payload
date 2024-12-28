import type { EmailOptions } from 'payload/config'

export const getEmailOptions = (): EmailOptions => {
  if (!process.env.SMTP_HOST) {
    return undefined
  }

  return {
    transportOptions: {
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    fromAddress: process.env.SMTP_USER,
    fromName: 'SportWeb LB',
  }
}
