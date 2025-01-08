import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import type { CollectionConfig } from 'payload/types'
import { tCollection } from '../utils/translations'
import { dateDisplayFormat } from '../constants'

const translate = tCollection('media')

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../../media'),
  },
  access: {
    read: () => true,
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
