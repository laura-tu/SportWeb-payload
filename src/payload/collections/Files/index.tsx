import { CollectionConfig } from 'payload/types'
import { tCollection } from '../../utils/translations'

const translate = tCollection('files')

const Files: CollectionConfig = {
  slug: 'files',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  upload: {
    staticDir: './uploads', // Directory to store uploaded files
    mimeTypes: [
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ], // Allowed file types
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
    },
    {
      name: 'user',
      label: translate('fields.user'),
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        position: 'sidebar',
        //readOnly: true,
      },
    },
  ],
}

export default Files
