import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { tCollection } from '../utils/translations'
import { dateDisplayFormat } from '../constants'
import { admins } from '../access/admins'
import { checkRole } from './Users/checkRole'

const translate = tCollection('media')

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../../media'),
  },
  access: {
    read: admins,
    // only users with the "admin" role will be able to see or manage this collection in the Payload admin dashboard
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: translate('fields.title'),
    },
    {
      name: 'date',
      type: 'date',
      label: translate('fields.date'),
      required: true,
      defaultValue: new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: dateDisplayFormat.sk,
        },
      },
    },
    {
      name: 'user',
      label: translate('fields.user'),
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: ['link'],
        },
      }),
    },
  ],
}
