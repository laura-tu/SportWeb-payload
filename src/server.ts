import dotenv from 'dotenv'
import path from 'path'
import { getEmailOptions } from './payload/utilities/sendPasswordEmail'

// This file is used to replace `server.ts` when ejecting i.e. `yarn eject`
// See `../eject.ts` for exact details on how this file is used
// See `./README.md#eject` for more information

dotenv.config()

import express from 'express'
import payload from 'payload'

import { seed } from './payload/seed'

const app = express()
const PORT = process.env.PORT || 3000

// Redirect root to the admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
    email: getEmailOptions(),
  })

  if (process.env.PAYLOAD_SEED === 'true') {
    await seed(payload)
    process.exit()
  }

  app.listen(PORT, async () => {
    payload.logger.info(`App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
  })
}

start()
