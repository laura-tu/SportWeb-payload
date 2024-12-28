import { CollectionConfig } from 'payload/types'
import { tCollection } from '../../utils/translations'

const translate = tCollection('test_results')

const TestResults: CollectionConfig = {
  slug: 'test_results',
  labels: {
    singular: translate('labels.singular'),
    plural: translate('labels.plural'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: translate('tabs.data'),
          fields: [
            {
              name: 'athlete',
              type: 'relationship',
              relationTo: 'u_athlete',
              required: true,
              label: translate('fields.athlete'),
            },
            {
              name: 'coach',
              type: 'relationship',
              relationTo: 'u_coach',
              label: translate('fields.coach'),
              required: false,
            },
            {
              name: 'testType',
              type: 'text',
              label: translate('fields.testType'),
              required: true,
            },
            {
              name: 'resultData',
              type: 'upload',
              label: translate('fields.resultData'), // This will store the Excel/Text file
              required: true,
              relationTo: 'files', // Store the file in the 'files' collection (Payload's default)
              admin: {
                description: translate('fields.resultDescription'),
              },
            },
            {
              name: 'date',
              type: 'date',
              label: translate('fields.date'),
              required: true,
            },
            {
              name: 'notes',
              type: 'textarea',
              label: translate('fields.notes'),
            },
          ],
        },
        {
          label: translate('tabs.graph'),
          fields: [],
        },
      ],
    },
  ],
  timestamps: true,
}

export default TestResults
