import type { Response } from 'express'
import type { Access } from 'payload/config'

import { APIError, ValidationError } from 'payload/errors'
import type { User } from '../payload-types'
import type { PayloadRequest as BasePayloadRequest } from 'payload/types'
import type z from 'zod'
import { ZodError } from 'zod'
import { ForbiddenError, UnauthorizedError } from './errors'

export interface PayloadRequest<B> extends BasePayloadRequest<User> {
  body: B
}

type Callback<B, R = unknown> = (req: PayloadRequest<B>) => Promise<R>

interface ResponseConfig {
  headers?: Record<string, string>
  status?: number
  responseType?: 'json' | 'pdf'
}

interface Options {
  access?: Access
  schema?: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>
  responseConfig?: ResponseConfig
}

export const handler = <B, R = unknown>(
  callback: Callback<B, R>,
  { access, schema, responseConfig }: Options = {},
) => {
  return async (req: PayloadRequest<B>, res: Response) => {
    const id = req.params.id

    try {
      if (access) {
        if (!req.user) {
          throw new UnauthorizedError()
        }
        if ((await access({ req, id })) === false) {
          throw new ForbiddenError()
        }
      }

      if (schema) {
        req.body = schema.parse(req.body) as B
      }

      const data = await callback(req)

      if (responseConfig?.headers) {
        for (const [key, value] of Object.entries(responseConfig.headers)) {
          res.setHeader(key, value)
        }
      }
      const responseType = responseConfig?.responseType || 'json'
      const status = responseConfig?.status || 200

      if (responseType === 'pdf') {
        res.status(status).send(Buffer.from(data as Buffer))
      } else if (responseType === 'json') {
        res.status(status).json(data)
      } else {
        res.status(status).send(data)
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues })
      } else if (error instanceof ValidationError) {
        const errors = error.isPublic ? error.data : undefined
        res.status(error.status).json({ message: error.message, errors })
      } else if (error instanceof APIError) {
        res.status(error.status).json({ message: error.message })
      } else {
        req.payload.logger.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}
