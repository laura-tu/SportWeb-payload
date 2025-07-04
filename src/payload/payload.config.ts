import { webpackBundler } from '@payloadcms/bundler-webpack'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloud } from '@payloadcms/plugin-cloud'
import nestedDocs from '@payloadcms/plugin-nested-docs'
//import redirects from '@payloadcms/plugin-redirects'
import seo from '@payloadcms/plugin-seo'
import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import { slateEditor } from '@payloadcms/richtext-slate'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload/config'
import QueryProvider from './providers/queryProvider'

import { Media } from './collections/Media'
import Users from './collections/Users'
import BeforeLogin from './components/BeforeLogin'
import { seed } from './endpoints/seed'

import CSport from './collections/C_Sport'
import CSportClub from './collections/C_SportClub'

import UAthlete from './collections/UAthlete'
import UCoach from './collections/UCoach'

import TestResults from './collections/Test_Results'
import CSportTest from './collections/C_SportTests'

import { i18nConfig } from '../payload/utils/translations'

const generateTitle: GenerateTitle = () => {
  return 'My Website'
}

const getPublicSiteUrl = (): string[] | undefined => {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.split(',')
  }
}

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

export default buildConfig({
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, './global-overrides.scss'),
    bundler: webpackBundler(),
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: [BeforeLogin],
      providers: [QueryProvider],
    },
    webpack: config => ({
      ...config,
      cache: {
        type: 'memory', // avoids filesystem cache and thus serialization
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          dotenv: path.resolve(__dirname, './dotenv.js'),
          [path.resolve(__dirname, './endpoints/seed')]: path.resolve(
            __dirname,
            './emptyModuleMock.js',
          ),
        },
      },
    }),
  },
  i18n: {
    ...i18nConfig,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [Media, Users, CSport, CSportClub, UAthlete, UCoach, TestResults, CSportTest],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: getPublicSiteUrl() ?? '*',
  csrf: getPublicSiteUrl() ?? [],
  endpoints: [
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      path: '/seed',
      method: 'get',
      handler: seed,
    },
  ],
  plugins: [
    /*redirects({
      collections: ['posts'],
    }),*/
    nestedDocs({
      collections: ['categories'],
    }),
    seo({
      collections: ['posts'],
      generateTitle,
      uploadsCollection: 'media',
    }),
    payloadCloud(),
  ],
  rateLimit: {
    trustProxy: true,
  },
})
